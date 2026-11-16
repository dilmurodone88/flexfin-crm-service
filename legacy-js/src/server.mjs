// flexfin-crm-service: FlexFin (SQL Server) uchun FAQAT-O'QIYDIGAN REST API.
// - Modellar Prisma DMMF'dan (db pull); bog'lanishlar (FK) va primary key'siz jadvallar bazaning o'zidan.
// - Bazaga yozish yo'q: Prisma darajasida bloklangan (readonly.mjs), raw SQL faqat catalog.mjs/feed.mjs dagi qat'iy SELECT.
// - Real vaqt: /v1/feed/stream (SSE) va /v1/feed/changes (kursor) - CdcCore.ChangedEntity asosida.
// - Barqarorlik: timeout, bir marta qayta urinish, graceful shutdown, /health /ready /metrics, JSON log.
import http from "node:http";
import { timingSafeEqual, randomUUID } from "node:crypto";
import { PrismaClient, Prisma } from "@prisma/client";
import { makeReadOnly } from "./readonly.mjs";
import { loadCatalog, readRaw, readOnlyQuery, tkey } from "./catalog.mjs";
import { log } from "./logger.mjs";
import { metrics } from "./metrics.mjs";
import { readChanges, latestLsn, validLsn, ZERO_LSN } from "./feed.mjs";
import { buildOpenApi } from "./openapi.mjs";

const env = process.env;
const VERSION = "1.1.0";
const PORT = Number(env.PORT ?? 8085);
const HOST = env.HOST ?? "0.0.0.0";
const API_KEY = env.API_KEY ?? "";
const list_ = (v) => (v ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const ALLOWED_IPS = list_(env.ALLOWED_IPS);
const TRUSTED_PROXIES = new Set(list_(env.TRUSTED_PROXIES)); // masalan nginx konteyner IP'si
const BLOCK = new Set(list_(env.BLOCK_MODELS ?? "SystemLog,SystemLogValues").map((s) => s.toLowerCase()));
const EXPOSE_PII = env.EXPOSE_PII === "true";
// Maxfiy ustunlar (parol/hash/token) - HAR DOIM yashiriladi, EXPOSE_PII ga bog'liq emas.
const SECRET_RE = /passw|salt|secret|token|^hash$|^sid$|keycloak/i;
// Shaxsiy ma'lumot ustunlari (nomi bo'yicha): EXPOSE_PII=true bilan ochiladi.
const PII_RE = new RegExp(
  env.PII_FIELDS_REGEX ??
    "passport|pinfl|jshshir|personalcitizen|taxcode|inps|phone|telephone|birth|serial|series|email|address|paymentcard|identificationtelephone",
  "i",
);
// Nomi bo'yicha aniqlab bo'lmaydigan, jadvalga xos ustunlar (FlexFin tahlilidan).
const TABLE_PII = { Passport: ["Number", "RegistrationPlace"], TelephoneNumber: ["Number"], Person: ["BirthPlace"] };
const MAX_TAKE = 1000;
const DEFAULT_TAKE = 100;
const MAX_CONCURRENT = Number(env.MAX_CONCURRENT ?? 8);
const MAX_STREAMS = Number(env.MAX_STREAMS ?? 10);
const DB_TIMEOUT_MS = Number(env.DB_TIMEOUT_MS ?? 25000);
const FEED_POLL_MS = Number(env.FEED_POLL_MS ?? 2000);

if (API_KEY.length < 24) {
  console.error("API_KEY kamida 24 belgi bo'lishi kerak (.env).");
  process.exit(1);
}
if (ALLOWED_IPS.length === 0) {
  console.error("ALLOWED_IPS bo'sh. Kamida bitta IP kiriting (.env), masalan 192.168.21.4.");
  process.exit(1);
}

const base = new PrismaClient({ log: ["error"] });
const prisma = makeReadOnly(base); // faqat-o'qish: yozish va raw SQL bloklangan

// ---- modellar registri (DMMF) ------------------------------------------------
const models = new Map(); // ruxsat etilgan: nom(lower) -> entry
const allByTable = new Map(); // "schema.jadval"(lower) -> entry (bloklanganlar ham)
for (const m of Prisma.dmmf.datamodel.models) {
  const fields = new Map(m.fields.filter((f) => f.kind === "scalar" || f.kind === "enum").map((f) => [f.name, f]));
  const pk = m.primaryKey?.fields ?? m.fields.filter((f) => f.isId).map((f) => f.name);
  const entry = {
    name: m.name,
    delegate: m.name[0].toLowerCase() + m.name.slice(1),
    table: tkey(m.schema ?? "dbo", m.dbName ?? m.name),
    blocked: BLOCK.has(m.name.toLowerCase()),
    fields,
    pk,
    refs: new Map(), // ustun -> { parent, parentName, parentColumn }
    referencedBy: [], // { child, column, parentColumn }
  };
  allByTable.set(entry.table, entry);
  if (!entry.blocked) models.set(m.name.toLowerCase(), entry);
}

// Bog'lanishlar (FK) va primary key'siz jadvallar - bazaning o'zidan (qat'iy SELECT).
const rawTables = new Map(); // "schema.jadval"(lower) -> { sch, tbl, cols }
let fkCount = 0;
let feedOk = false;
try {
  const catalog = await loadCatalog(base);
  for (const fk of catalog.fks) {
    const child = allByTable.get(fk.child);
    if (!child || child.blocked || !child.fields.has(fk.column)) continue;
    const parent = allByTable.get(fk.parent);
    const p = parent && !parent.blocked && parent.fields.has(fk.parentColumn) ? parent : null;
    child.refs.set(fk.column, { parent: p, parentName: fk.parentName, parentColumn: fk.parentColumn });
    if (p) p.referencedBy.push({ child, column: fk.column, parentColumn: fk.parentColumn });
    fkCount++;
  }
  const SKIP_RAW = /^(sd|sysdiagrams|systranschemas)$/i;
  for (const [k, t] of catalog.tables) {
    if (allByTable.has(k) || t.sch.toLowerCase() === "cdc" || SKIP_RAW.test(t.tbl)) continue;
    if (BLOCK.has(t.tbl.toLowerCase()) || BLOCK.has(k)) continue;
    rawTables.set(k, t);
  }
  feedOk = catalog.tables.has("cdccore.changedentity");
} catch (e) {
  log("error", "katalog o'qilmadi: bog'lanishlar, raw jadvallar va feed o'chiq", { error: e.message });
}
log("info", "ishga tushdi", { version: VERSION, models: models.size, relations: fkCount, rawTables: rawTables.size, feed: feedOk, blocked: [...BLOCK] });

// ---- yordamchilar -------------------------------------------------------------
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const bad = (msg) => new HttpError(400, msg);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function coerce(field, raw) {
  switch (field.type) {
    case "Int": {
      const n = Number(raw);
      if (!Number.isInteger(n)) throw bad(`${field.name}: butun son kerak`);
      return n;
    }
    case "BigInt":
      try { return BigInt(raw); } catch { throw bad(`${field.name}: butun son kerak`); }
    case "Float": {
      const n = Number(raw);
      if (Number.isNaN(n)) throw bad(`${field.name}: son kerak`);
      return n;
    }
    case "Decimal":
      try { return new Prisma.Decimal(raw); } catch { throw bad(`${field.name}: son kerak`); }
    case "Boolean":
      return raw === "true" || raw === "1";
    case "DateTime": {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) throw bad(`${field.name}: sana noto'g'ri (ISO kerak)`);
      return d;
    }
    case "String":
      return raw;
    default:
      throw bad(`${field.name}: turi (${field.type}) bo'yicha filtr yo'q`);
  }
}

const RESERVED = new Set(["take", "after", "orderBy", "select", "count", "expand", "skip", "by"]);
const OPS = new Set(["gt", "gte", "lt", "lte", "contains", "startsWith", "not", "in", "isnull"]);

function buildWhere(model, params) {
  const where = {};
  for (const [key, val] of params) {
    if (RESERVED.has(key)) continue;
    const [name, op = "equals"] = key.split("__");
    const field = model.fields.get(name);
    if (!field) throw bad(`Noma'lum maydon: ${name}`);
    if (op !== "equals" && !OPS.has(op)) throw bad(`Noma'lum operator: ${op}`);
    if ((op === "contains" || op === "startsWith") && field.type !== "String") throw bad(`${name}: ${op} faqat String uchun`);
    if (op === "isnull") {
      // ?GCRecord__isnull=true -> o'chirilmagan yozuvlar (XPO soft-delete); false -> o'chirilganlar
      Object.assign((where[name] ??= {}), val === "true" || val === "1" ? { equals: null } : { not: null });
      continue;
    }
    const value = op === "in" ? val.split(",").map((v) => coerce(field, v)) : coerce(field, val);
    where[name] = { ...(where[name] ?? {}), [op]: value };
  }
  return where;
}

function maskRow(row, model) {
  const extra = TABLE_PII[model.name] ?? [];
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    const isKey = model.pk.includes(k) || model.refs.has(k); // id ustunlari ("Passport" FK) yashirilmaydi
    const secret = SECRET_RE.test(k);
    const pii = !EXPOSE_PII && !isKey && (PII_RE.test(k) || extra.includes(k));
    out[k] = v != null && (secret || pii) ? "***" : v;
  }
  return out;
}

function toJson(data) {
  return JSON.stringify(data, (_k, v) => {
    if (typeof v === "bigint") return v.toString();
    if (v && v.type === "Buffer" && Array.isArray(v.data)) return "[binary]";
    return v;
  });
}

function send(res, status, body, type = "application/json; charset=utf-8") {
  const payload = typeof body === "string" ? body : toJson(body);
  res.writeHead(status, { "content-type": type, "cache-control": "no-store", "x-content-type-options": "nosniff" });
  res.end(payload);
}

function clientIp(req) {
  const sock = (req.socket.remoteAddress ?? "").replace(/^::ffff:/, "");
  if (TRUSTED_PROXIES.has(sock)) {
    const xff = String(req.headers["x-forwarded-for"] ?? "").split(",")[0].trim().replace(/^::ffff:/, "");
    if (xff) return xff;
  }
  return sock;
}

function keyOk(req) {
  const given = Buffer.from(String(req.headers["x-api-key"] ?? ""));
  const want = Buffer.from(API_KEY);
  return given.length === want.length && timingSafeEqual(given, want);
}

const TRANSIENT = /ECONNRESET|ETIMEDOUT|ECONNREFUSED|Connection|socket|timed out|Can't reach/i;
const isTransient = (e) => !(e instanceof HttpError) && (["P1001", "P1002", "P1008", "P1017", "P2024", "P2034"].includes(e.code) || TRANSIENT.test(e.message ?? ""));

async function withTimeout(promise) {
  let t;
  const timeout = new Promise((_, rej) => { t = setTimeout(() => rej(new HttpError(504, "Baza javob bermadi (timeout)")), DB_TIMEOUT_MS); });
  try { return await Promise.race([promise, timeout]); } finally { clearTimeout(t); }
}

// GET'lar idempotent: vaqtinchalik ulanish xatosida bir marta qayta urinamiz.
async function resilient(fn) {
  try {
    return await withTimeout(fn());
  } catch (e) {
    if (!isTransient(e)) throw e;
    metrics.dbError();
    await sleep(300);
    return await withTimeout(fn());
  }
}

// ---- marshrut mantig'i ----------------------------------------------------------
function parseExpand(model, raw) {
  if (!raw) return [];
  const all = [...model.refs.keys()];
  const cols = raw === "*" ? all.slice(0, 25) : raw.split(",").map((c) => c.trim()).filter(Boolean);
  if (cols.length > 25) throw bad("expand: eng ko'pi bilan 25 ta");
  for (const c of cols) if (!model.refs.has(c)) throw bad(`expand: '${c}' bog'lanish emas. Mumkin: ${all.join(", ") || "yo'q"}`);
  return cols;
}

async function expandRows(rows, model, cols) {
  const out = rows.map(() => ({}));
  for (const col of cols) {
    const ref = model.refs.get(col);
    if (!ref.parent) {
      out.forEach((o) => { o[col] = null; }); // ota jadval modelda yo'q (primary key'siz/bloklangan)
      continue;
    }
    const vals = new Map();
    for (const r of rows) if (r[col] != null) vals.set(String(r[col]), r[col]);
    const found = vals.size
      ? await prisma[ref.parent.delegate].findMany({ where: { [ref.parentColumn]: { in: [...vals.values()] } }, take: MAX_TAKE })
      : [];
    const byKey = new Map(found.map((x) => [String(x[ref.parentColumn]), maskRow(x, ref.parent)]));
    rows.forEach((r, i) => { out[i][col] = r[col] == null ? null : (byKey.get(String(r[col])) ?? null); });
  }
  return out;
}

async function present(model, rows, expandCols) {
  const ex = expandCols.length ? await expandRows(rows, model, expandCols) : null;
  return rows.map((r, i) => {
    const m = maskRow(r, model);
    if (ex) m._expand = ex[i];
    return m;
  });
}

async function list(model, url, extraWhere = {}) {
  const p = url.searchParams;
  const take = Math.min(Math.max(Number(p.get("take") ?? DEFAULT_TAKE) || DEFAULT_TAKE, 1), MAX_TAKE);
  const expandCols = parseExpand(model, p.get("expand"));
  const args = { take, where: { ...buildWhere(model, p), ...extraWhere } };

  const sel = p.get("select");
  if (sel) {
    args.select = {};
    for (const f of sel.split(",")) {
      if (!model.fields.has(f)) throw bad(`Noma'lum maydon: ${f}`);
      args.select[f] = true;
    }
    for (const c of expandCols) args.select[c] = true;
    for (const c of model.pk) args.select[c] = true;
  }

  const ob = p.get("orderBy");
  if (ob) {
    const [f, dir = "asc"] = ob.split(":");
    if (!model.fields.has(f) || !["asc", "desc"].includes(dir)) throw bad("orderBy noto'g'ri (maydon:asc|desc)");
    args.orderBy = { [f]: dir };
  } else if (model.pk.length > 0) {
    args.orderBy = model.pk.map((f) => ({ [f]: "asc" }));
  }

  const after = p.get("after");
  if (after != null) {
    if (model.pk.length !== 1) throw bad("after faqat bitta ustunli primary key uchun");
    args.cursor = { [model.pk[0]]: coerce(model.fields.get(model.pk[0]), after) };
    args.skip = 1;
  }

  const rows = await prisma[model.delegate].findMany(args);
  const body = { model: model.name, count: rows.length, data: await present(model, rows, expandCols) };
  if (model.pk.length === 1 && rows.length === take) body.nextCursor = rows[rows.length - 1][model.pk[0]];
  if (p.get("count") === "1") body.total = await prisma[model.delegate].count({ where: args.where }); // og'ir: faqat so'ralganda
  return body;
}

async function one(model, id, expandCols) {
  if (model.pk.length !== 1) throw bad("Bu jadvalda bitta ustunli primary key yo'q; ro'yxat orqali filtrlang");
  const row = await prisma[model.delegate].findUnique({ where: { [model.pk[0]]: coerce(model.fields.get(model.pk[0]), id) } });
  if (!row) throw new HttpError(404, "Topilmadi");
  return { model: model.name, data: (await present(model, [row], expandCols))[0] };
}

const childLinks = (model) => model.referencedBy.filter((r) => model.pk.length === 1 && r.parentColumn === model.pk[0]);

async function children(model, id, childName, url) {
  const child = models.get(String(childName).toLowerCase());
  const links = child ? childLinks(model).filter((r) => r.child === child) : [];
  if (!links.length) throw new HttpError(404, `${model.name} bilan ${childName} orasida bog'lanish yo'q`);
  const by = url.searchParams.get("by") ?? (links.length === 1 ? links[0].column : null);
  if (!by || !links.some((l) => l.column === by)) throw bad(`by= kerak. Mumkin: ${links.map((l) => l.column).join(", ")}`);
  return list(child, url, { [by]: coerce(child.fields.get(by), id) });
}

async function full(model, id) {
  const body = await one(model, id, [...model.refs.keys()].slice(0, 25));
  body.children = childLinks(model).map((l) => ({ model: l.child.name, by: l.column, path: `/v1/${model.name}/${id}/${l.child.name}?by=${l.column}` }));
  return body;
}

const describe = (m) => ({
  model: m.name,
  table: m.table,
  pk: m.pk,
  fields: [...m.fields.keys()],
  references: Object.fromEntries([...m.refs].map(([c, r]) => [c, r.parent ? `${r.parent.name}.${r.parentColumn}` : `${r.parentName}.${r.parentColumn} (modelsiz)`])),
  referencedBy: m.referencedBy.map((r) => ({ model: r.child.name, by: r.column })),
});

async function listRaw(table, url) {
  const p = url.searchParams;
  const take = Math.min(Math.max(Number(p.get("take") ?? DEFAULT_TAKE) || DEFAULT_TAKE, 1), MAX_TAKE);
  const skip = Math.max(Number(p.get("skip") ?? 0) || 0, 0);
  let rows;
  try {
    rows = await readRaw(base, table, p, { take, skip });
  } catch (e) {
    if (e.status) throw new HttpError(e.status, e.message);
    throw e;
  }
  const shape = { name: table.tbl, pk: [], refs: new Map() };
  const body = { table: `${table.sch}.${table.tbl}`, count: rows.length, data: rows.map((r) => maskRow(r, shape)) };
  if (rows.length === take) body.nextSkip = skip + take;
  return body;
}

async function changes(url) {
  if (!feedOk) throw new HttpError(404, "Feed mavjud emas (CdcCore.ChangedEntity topilmadi)");
  const after = url.searchParams.get("after") ?? ZERO_LSN;
  if (!validLsn(after)) throw bad("after: LSN (0x + 20 hex belgi) kerak");
  const take = Math.min(Math.max(Number(url.searchParams.get("take") ?? 500) || 500, 1), 5000);
  const rows = await readChanges(base, { after, take });
  return { count: rows.length, data: rows, nextAfter: rows.length ? rows[rows.length - 1].Lsn : after };
}

async function route(url) {
  const parts = url.pathname.split("/").filter(Boolean).map(decodeURIComponent);
  if (parts[0] === "ready") {
    await readOnlyQuery(base, "SELECT 1 AS ok");
    return { ok: true };
  }
  if (parts[0] === "metrics") return { __text: metrics.render({ inflight, streams: streams.size, models: models.size, relations: fkCount }) };
  if (parts[0] !== "v1" || parts.length === 1) throw new HttpError(404, "Topilmadi");
  if (parts[1] === "openapi.json") return buildOpenApi([...models.values()], { version: VERSION });
  if (parts[1] === "models") {
    return { data: [...models.values()].map(describe), rawTables: [...rawTables.values()].map((t) => ({ table: `${t.sch}.${t.tbl}`, columns: t.cols.map((c) => c.name) })) };
  }
  if (parts[1] === "_graph") {
    const edges = [];
    for (const m of models.values()) for (const [c, r] of m.refs) edges.push({ from: `${m.name}.${c}`, to: `${r.parent ? r.parent.name : r.parentName}.${r.parentColumn}` });
    return { count: edges.length, edges };
  }
  if (parts[1] === "feed") {
    if (parts[2] === "changes") return changes(url);
    if (parts[2] === "latest") {
      if (!feedOk) throw new HttpError(404, "Feed mavjud emas");
      return { lsn: await latestLsn(base) };
    }
    throw new HttpError(404, "Topilmadi");
  }
  if (parts[1] === "raw") {
    if (parts.length === 2) return { data: [...rawTables.values()].map((t) => `${t.sch}.${t.tbl}`) };
    const t = rawTables.get(String(parts[2]).toLowerCase());
    if (!t) throw new HttpError(404, "Raw jadval topilmadi (/v1/raw ro'yxatiga qarang)");
    return listRaw(t, url);
  }
  const model = models.get(String(parts[1]).toLowerCase());
  if (!model) throw new HttpError(404, "Model topilmadi yoki bloklangan");
  if (parts.length === 2) return list(model, url);
  if (parts.length === 3) return one(model, parts[2], parseExpand(model, url.searchParams.get("expand")));
  if (parts[3] === "full") return full(model, parts[2]);
  return children(model, parts[2], parts[3], url);
}

// ---- real vaqt: Server-Sent Events ------------------------------------------------
const streams = new Set();
let shuttingDown = false;

async function stream(req, res, url, reqId) {
  if (!feedOk) throw new HttpError(404, "Feed mavjud emas (CdcCore.ChangedEntity topilmadi)");
  if (streams.size >= MAX_STREAMS) throw new HttpError(429, "Oqimlar soni chegaradan oshdi");
  let after = url.searchParams.get("after") ?? String(req.headers["last-event-id"] ?? "");
  if (!after || after === "now") after = await resilient(() => latestLsn(base)); // faqat yangilari
  else if (after === "0") after = ZERO_LSN; // boshidan (qayta o'ynash)
  if (!validLsn(after)) throw bad("after: now | 0 | LSN (0x + 20 hex)");

  res.writeHead(200, { "content-type": "text/event-stream", "cache-control": "no-store", connection: "keep-alive", "x-accel-buffering": "no" });
  res.write("retry: 3000\n\n");
  const s = { closed: false };
  streams.add(s);
  req.on("close", () => { s.closed = true; streams.delete(s); });
  let lastWrite = Date.now();
  while (!s.closed && !shuttingDown) {
    let rows = [];
    try {
      rows = await readChanges(base, { after, take: 500 });
      for (const r of rows) {
        res.write(`id: ${r.Lsn}\nevent: change\ndata: ${toJson(r)}\n\n`);
        after = r.Lsn;
      }
      if (rows.length) lastWrite = Date.now();
    } catch (e) {
      metrics.dbError();
      log("error", "stream xatosi", { reqId, error: e.message });
      res.write(`event: error\ndata: ${JSON.stringify({ error: "baza vaqtincha mavjud emas" })}\n\n`);
      lastWrite = Date.now();
    }
    if (Date.now() - lastWrite > 15000) { res.write(": ping\n\n"); lastWrite = Date.now(); }
    if (rows.length < 500) await sleep(FEED_POLL_MS);
  }
  streams.delete(s);
  res.end();
}

// ---- HTTP server ------------------------------------------------------------------
let inflight = 0;
const label = (p) => p.replace(/\/\d+/g, "/:id").replace(/^(\/v1\/raw\/)[^/]+/, "$1:table").slice(0, 80);

const server = http.createServer(async (req, res) => {
  const t0 = process.hrtime.bigint();
  const reqId = String(req.headers["x-request-id"] ?? "").slice(0, 64) || randomUUID();
  const ip = clientIp(req);
  const url = new URL(req.url ?? "/", "http://x");
  res.setHeader("x-request-id", reqId);
  let errMsg;

  res.on("close", () => {
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    const status = res.statusCode;
    if (url.pathname !== "/health") metrics.observe(label(url.pathname), status, ms);
    // Maxfiylik: so'rov qiymatlari (masalan pasport raqami) logga yozilmaydi, faqat parametr nomlari.
    log(status >= 500 ? "error" : "info", "req", {
      reqId, ip, method: req.method, path: url.pathname, params: [...url.searchParams.keys()].join(","), status, ms: Math.round(ms), ...(errMsg ? { error: errMsg } : {}),
    });
  });

  try {
    if (url.pathname === "/health") return send(res, 200, { ok: true, service: "flexfin-crm-service", version: VERSION, models: models.size, relations: fkCount, rawTables: rawTables.size, feed: feedOk });
    if (!ALLOWED_IPS.includes(ip)) throw new HttpError(403, "IP ruxsat etilmagan");
    if (!keyOk(req)) throw new HttpError(401, "API kalit noto'g'ri");
    if (req.method !== "GET") throw new HttpError(405, "Faqat GET");
    if (shuttingDown) throw new HttpError(503, "Server o'chirilmoqda");
    if (url.pathname === "/v1/feed/stream") return await stream(req, res, url, reqId);
    if (inflight >= MAX_CONCURRENT) throw new HttpError(429, "Band, keyinroq urinib ko'ring");
    inflight++;
    try {
      const out = await resilient(() => route(url));
      if (out && out.__text) return send(res, 200, out.__text, "text/plain; version=0.0.4");
      return send(res, 200, out);
    } finally {
      inflight--;
    }
  } catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    if (status >= 500) errMsg = e.message;
    if (res.headersSent) return res.end();
    send(res, status, { error: e instanceof HttpError ? e.message : "Ichki xato", reqId });
  }
});

server.keepAliveTimeout = 65000; // nginx (60s) dan katta bo'lsin
server.headersTimeout = 66000;
server.requestTimeout = 30000;
server.listen(PORT, HOST, () => log("info", `flexfin-crm-service: http://${HOST}:${PORT}`));

async function shutdown(sig) {
  if (shuttingDown) return;
  shuttingDown = true;
  log("info", "o'chirilmoqda", { sig });
  server.close();
  for (let i = 0; i < 100 && (inflight > 0 || streams.size > 0); i++) await sleep(100); // 10s gacha kutamiz
  await base.$disconnect().catch(() => {});
  process.exit(0);
}
for (const sig of ["SIGINT", "SIGTERM"]) process.on(sig, () => shutdown(sig));
process.on("unhandledRejection", (e) => log("error", "unhandledRejection", { error: String(e?.message ?? e) }));
process.on("uncaughtException", (e) => {
  log("error", "uncaughtException", { error: String(e?.message ?? e) });
  process.exit(1); // supervisor (Docker/Task Scheduler) qayta ishga tushiradi
});
