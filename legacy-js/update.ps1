# flexfin-crm-service: yangilanish. Bazaga tegmaydi.
$ErrorActionPreference = "Stop"
$root = "C:\flexfin-crm-service"
function W($rel, $text) { [IO.File]::WriteAllText((Join-Path $root $rel), $text, (New-Object Text.UTF8Encoding($false))) }
W 'src\server.mjs' @'
// FlexFin faqat-o'qiydigan GET servisi.
// - Modellar Prisma DMMF'dan (db pull natijasi) avtomatik olinadi: har jadval = /v1/<model>
// - Bazaga FAQAT findMany / findUnique / count chaqiriladi. Yozish yo'q.
// - Himoya: x-api-key, IP ro'yxati, take chegarasi, parallel so'rovlar chegarasi, PII yashirish.
import http from "node:http";
import { timingSafeEqual } from "node:crypto";
import { PrismaClient, Prisma } from "@prisma/client";
import { makeReadOnly } from "./readonly.mjs";

const env = process.env;
const PORT = Number(env.PORT ?? 8085);
const HOST = env.HOST ?? "0.0.0.0";
const API_KEY = env.API_KEY ?? "";
const ALLOWED_IPS = (env.ALLOWED_IPS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const BLOCK = new Set((env.BLOCK_MODELS ?? "SystemLog,SystemLogValues").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
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
const TABLE_PII = {
  Passport: ["Number", "RegistrationPlace"],
  TelephoneNumber: ["Number"],
  Person: ["BirthPlace"],
};
const MAX_TAKE = 1000;
const DEFAULT_TAKE = 100;
const MAX_CONCURRENT = 8;

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
const models = new Map();
for (const m of Prisma.dmmf.datamodel.models) {
  if (BLOCK.has(m.name.toLowerCase())) continue;
  const fields = new Map(
    m.fields.filter((f) => f.kind === "scalar" || f.kind === "enum").map((f) => [f.name, f]),
  );
  const pk = m.primaryKey?.fields ?? m.fields.filter((f) => f.isId).map((f) => f.name);
  models.set(m.name.toLowerCase(), {
    name: m.name,
    delegate: m.name[0].toLowerCase() + m.name.slice(1),
    fields,
    pk,
  });
}
console.log(`Modellar: ${models.size} ta (bloklangan: ${[...BLOCK].join(", ") || "yo'q"})`);

// ---- yordamchilar -------------------------------------------------------------
class HttpError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}
const bad = (msg) => new HttpError(400, msg);

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

const RESERVED = new Set(["take", "after", "orderBy", "select", "count"]);
const OPS = new Set(["gt", "gte", "lt", "lte", "contains", "startsWith", "not", "in", "isnull"]);

function buildWhere(model, params) {
  const where = {};
  for (const [key, val] of params) {
    if (RESERVED.has(key)) continue;
    const [name, op = "equals"] = key.split("__");
    const field = model.fields.get(name);
    if (!field) throw bad(`Noma'lum maydon: ${name}`);
    if (op !== "equals" && !OPS.has(op)) throw bad(`Noma'lum operator: ${op}`);
    if ((op === "contains" || op === "startsWith") && field.type !== "String") {
      throw bad(`${name}: ${op} faqat String uchun`);
    }
    if (op === "isnull") {
      // ?GCRecord__isnull=true  -> o'chirilmagan yozuvlar (XPO soft-delete); false -> o'chirilganlar
      Object.assign((where[name] ??= {}), val === "true" || val === "1" ? { equals: null } : { not: null });
      continue;
    }
    const value = op === "in" ? val.split(",").map((v) => coerce(field, v)) : coerce(field, val);
    where[name] = { ...(where[name] ?? {}), [op]: value };
  }
  return where;
}

function maskRow(row, modelName) {
  const extra = TABLE_PII[modelName] ?? [];
  const out = {};
  for (const [k, v] of Object.entries(row)) {
    const secret = SECRET_RE.test(k);
    const pii = !EXPOSE_PII && (PII_RE.test(k) || extra.includes(k));
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

function send(res, status, body) {
  const json = toJson(body);
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(json);
}

function clientIp(req) {
  return (req.socket.remoteAddress ?? "").replace(/^::ffff:/, "");
}

function keyOk(req) {
  const given = Buffer.from(String(req.headers["x-api-key"] ?? ""));
  const want = Buffer.from(API_KEY);
  return given.length === want.length && timingSafeEqual(given, want);
}

// ---- marshrutlar ----------------------------------------------------------------
async function list(model, url) {
  const p = url.searchParams;
  const take = Math.min(Math.max(Number(p.get("take") ?? DEFAULT_TAKE) || DEFAULT_TAKE, 1), MAX_TAKE);
  const args = { take, where: buildWhere(model, p) };

  const sel = p.get("select");
  if (sel) {
    args.select = {};
    for (const f of sel.split(",")) {
      if (!model.fields.has(f)) throw bad(`Noma'lum maydon: ${f}`);
      args.select[f] = true;
    }
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
  const body = { model: model.name, count: rows.length, data: rows.map((r) => maskRow(r, model.name)) };
  if (model.pk.length === 1 && rows.length === take) body.nextCursor = rows[rows.length - 1][model.pk[0]];
  // jami son og'ir (katta jadvalda) - faqat so'ralganda
  if (p.get("count") === "1") body.total = await prisma[model.delegate].count({ where: args.where });
  return body;
}

async function one(model, id) {
  if (model.pk.length !== 1) throw bad("Bu jadvalda bitta ustunli primary key yo'q; ro'yxat orqali filtrlang");
  const row = await prisma[model.delegate].findUnique({
    where: { [model.pk[0]]: coerce(model.fields.get(model.pk[0]), id) },
  });
  if (!row) throw new HttpError(404, "Topilmadi");
  return { model: model.name, data: maskRow(row, model.name) };
}

let inflight = 0;
const server = http.createServer(async (req, res) => {
  const started = Date.now();
  const ip = clientIp(req);
  const url = new URL(req.url ?? "/", "http://x");
  try {
    if (url.pathname === "/health") return send(res, 200, { ok: true, service: "flexfin-crm-service" });
    if (!ALLOWED_IPS.includes(ip)) throw new HttpError(403, "IP ruxsat etilmagan");
    if (!keyOk(req)) throw new HttpError(401, "API kalit noto'g'ri");
    if (req.method !== "GET") throw new HttpError(405, "Faqat GET");
    if (inflight >= MAX_CONCURRENT) throw new HttpError(429, "Band, keyinroq urinib ko'ring");
    inflight++;
    try {
      const parts = url.pathname.split("/").filter(Boolean); // ["v1", model, id?]
      if (parts[0] !== "v1") throw new HttpError(404, "Topilmadi");
      if (parts.length === 1) throw new HttpError(404, "Topilmadi");
      if (parts[1] === "models") {
        return send(res, 200, {
          data: [...models.values()].map((m) => ({ model: m.name, pk: m.pk, fields: [...m.fields.keys()] })),
        });
      }
      const model = models.get(String(parts[1]).toLowerCase());
      if (!model) throw new HttpError(404, "Model topilmadi yoki bloklangan");
      const body = parts.length >= 3 ? await one(model, decodeURIComponent(parts[2])) : await list(model, url);
      return send(res, 200, body);
    } finally {
      inflight--;
    }
  } catch (e) {
    const status = e instanceof HttpError ? e.status : 500;
    if (status === 500) console.error("XATO", e);
    send(res, status, { error: e instanceof HttpError ? e.message : "Ichki xato" });
  } finally {
    console.log(`${ip} ${req.method} ${url.pathname} ${res.statusCode} ${Date.now() - started}ms`);
  }
});

server.listen(PORT, HOST, () => console.log(`flexfin-crm-service: http://${HOST}:${PORT}`));

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, async () => {
    server.close();
    await base.$disconnect();
    process.exit(0);
  });
}

'@
W 'src\readonly.mjs' @'
// Prisma klientini FAQAT-O'QISH rejimiga o'tkazadi.
// - Faqat findMany / findUnique / findFirst / count ruxsat etiladi.
// - create / update / delete / upsert / *Many / aggregate-yozish hammasi xato bilan to'xtaydi.
// - $executeRaw / $queryRaw (va Unsafe variantlari), $transaction taqiqlanadi: ular orqali SQL yozish mumkin.
export const READ_OPS = new Set(["findMany", "findUnique", "findFirst", "count"]);

const deny = (name) => () => {
  throw new Error(`${name}: faqat-o'qish rejimi, taqiqlangan`);
};

export function makeReadOnly(base) {
  return base.$extends({
    name: "read-only",
    query: {
      $allModels: {
        $allOperations({ model, operation, args, query }) {
          if (!READ_OPS.has(operation)) {
            throw new Error(`${model}.${operation}: faqat-o'qish rejimi, taqiqlangan`);
          }
          return query(args);
        },
      },
    },
    client: {
      $executeRaw: deny("$executeRaw"),
      $executeRawUnsafe: deny("$executeRawUnsafe"),
      $queryRaw: deny("$queryRaw"),
      $queryRawUnsafe: deny("$queryRawUnsafe"),
      $transaction: deny("$transaction"),
    },
  });
}

'@
Write-Host "Yangilandi. Serverni qayta ishga tushiring."
