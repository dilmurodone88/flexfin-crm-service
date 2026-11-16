# flexfin-api bootstrap (109, Windows Server). Faqat o'qiydi: bazaga hech narsa yozmaydi.
$ErrorActionPreference = "Stop"
[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12
$root = "C:\flexfin-crm-service"
New-Item -ItemType Directory -Force -Path $root, "$root\src", "$root\client", "$root\prisma" | Out-Null
function W($rel, $text) { [IO.File]::WriteAllText((Join-Path $root $rel), $text, (New-Object Text.UTF8Encoding($false))) }
W 'package.json' @'
{
  "name": "flexfin-api",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "description": "FlexFin (SQL Server) uchun faqat-o'qiydigan GET servis. Modellar `prisma db pull` bilan bazadan olinadi.",
  "engines": { "node": ">=18.18" },
  "scripts": {
    "pull": "prisma db pull",
    "generate": "prisma generate",
    "start": "node src/server.mjs",
    "up": "prisma db pull && prisma generate && node src/server.mjs"
  },
  "dependencies": {
    "@prisma/client": "^6.19.3",
    "prisma": "^6.19.3"
  }
}

'@
W 'prisma\schema.prisma' @'
// Faqat generator va datasource shu yerda. Modellar `npm run up` (prisma db pull) bilan
// FlexFin bazasidan avtomatik o'qiladi - qo'lda yozilmaydi. db pull bazaga HECH NARSA yozmaydi.
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider     = "sqlserver"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
  schemas  = ["dbo", "FlexFinApi", "PMT", "CBReport", "Grki", "CloseOperDay", "CdcCore"]
}

'@
W 'src\server.mjs' @'
// FlexFin faqat-o'qiydigan GET servisi.
// - Modellar Prisma DMMF'dan (db pull natijasi) avtomatik olinadi: har jadval = /v1/<model>
// - Bazaga FAQAT findMany / findUnique / count chaqiriladi. Yozish yo'q.
// - Himoya: x-api-key, IP ro'yxati, take chegarasi, parallel so'rovlar chegarasi, PII yashirish.
import http from "node:http";
import { timingSafeEqual } from "node:crypto";
import { PrismaClient, Prisma } from "@prisma/client";

const env = process.env;
const PORT = Number(env.PORT ?? 8085);
const HOST = env.HOST ?? "0.0.0.0";
const API_KEY = env.API_KEY ?? "";
const ALLOWED_IPS = (env.ALLOWED_IPS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
const BLOCK = new Set((env.BLOCK_MODELS ?? "SystemLog,SystemLogValues").split(",").map((s) => s.trim().toLowerCase()).filter(Boolean));
const EXPOSE_PII = env.EXPOSE_PII === "true";
const PII_RE = new RegExp(env.PII_FIELDS_REGEX ?? "passport|pinfl|jshshir|phone|telephone|birth|serial|email|address", "i");
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

const prisma = new PrismaClient({ log: ["error"] });

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
const OPS = new Set(["gt", "gte", "lt", "lte", "contains", "startsWith", "not", "in"]);

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
    const value = op === "in" ? val.split(",").map((v) => coerce(field, v)) : coerce(field, val);
    where[name] = { ...(where[name] ?? {}), [op]: value };
  }
  return where;
}

function maskRow(row) {
  if (EXPOSE_PII) return row;
  const out = {};
  for (const [k, v] of Object.entries(row)) out[k] = v != null && PII_RE.test(k) ? "***" : v;
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
  const body = { model: model.name, count: rows.length, data: rows.map(maskRow) };
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
  return { model: model.name, data: maskRow(row) };
}

let inflight = 0;
const server = http.createServer(async (req, res) => {
  const started = Date.now();
  const ip = clientIp(req);
  const url = new URL(req.url ?? "/", "http://x");
  try {
    if (url.pathname === "/health") return send(res, 200, { ok: true });
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

server.listen(PORT, HOST, () => console.log(`flexfin-api: http://${HOST}:${PORT}`));

for (const sig of ["SIGINT", "SIGTERM"]) {
  process.on(sig, async () => {
    server.close();
    await prisma.$disconnect();
    process.exit(0);
  });
}

'@
W 'client\pull.mjs' @'
// 21.4 tomonda ishlaydigan olib oluvchi (poller). Node >=20, qo'shimcha paket kerak emas.
//   FLEXFIN_URL=http://192.168.3.109:8085 FLEXFIN_KEY=... node pull.mjs <Model> [--every=30] [--take=500]
// --every=N : N soniyada bir takror (real vaqtga yaqin). Berilmasa bir marta ishlaydi (cron uchun).
// Oxirgi o'qilgan primary key `state-<Model>.json` da saqlanadi; keyingi chaqiriq faqat yangisini oladi.
// Natija: har yozuv alohida JSON qator (stdout) yoki SINK_URL ga POST (ma'lum servis manzili).
import { readFile, writeFile } from "node:fs/promises";

const [model, ...rest] = process.argv.slice(2);
if (!model) {
  console.error("Foydalanish: node pull.mjs <Model> [--every=30] [--take=500]");
  process.exit(1);
}
const opt = Object.fromEntries(rest.filter((a) => a.startsWith("--")).map((a) => a.slice(2).split("=")));
const BASE = process.env.FLEXFIN_URL;
const KEY = process.env.FLEXFIN_KEY;
const SINK = process.env.SINK_URL; // ixtiyoriy
const take = Number(opt.take ?? 500);
const stateFile = `state-${model}.json`;
if (!BASE || !KEY) {
  console.error("FLEXFIN_URL va FLEXFIN_KEY kerak");
  process.exit(1);
}

async function loadState() {
  try { return JSON.parse(await readFile(stateFile, "utf8")); } catch { return { after: null }; }
}

async function deliver(rows) {
  if (!SINK) {
    for (const r of rows) console.log(JSON.stringify(r));
    return;
  }
  const r = await fetch(SINK, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ model, rows }),
  });
  if (!r.ok) throw new Error(`SINK ${r.status}`);
}

async function runOnce() {
  const state = await loadState();
  let total = 0;
  for (;;) {
    const u = new URL(`/v1/${model}`, BASE);
    u.searchParams.set("take", String(take));
    if (state.after != null) u.searchParams.set("after", String(state.after));
    const res = await fetch(u, { headers: { "x-api-key": KEY } });
    if (!res.ok) throw new Error(`${res.status} ${await res.text()}`);
    const body = await res.json();
    if (body.data.length === 0) break;
    await deliver(body.data);
    total += body.data.length;
    const last = body.data[body.data.length - 1];
    state.after = body.nextCursor ?? last[Object.keys(last)[0]];
    await writeFile(stateFile, JSON.stringify(state));
    if (body.data.length < take) break;
  }
  return total;
}

const every = Number(opt.every ?? 0);
if (!every) {
  console.error(`${model}: ${await runOnce()} yangi yozuv`);
} else {
  for (;;) {
    try {
      const n = await runOnce();
      if (n) console.error(`${new Date().toISOString()} ${model}: ${n} yangi`);
    } catch (e) {
      console.error(`${new Date().toISOString()} XATO: ${e.message}`);
    }
    await new Promise((r) => setTimeout(r, every * 1000));
  }
}

'@
W 'up.ps1' @'
# Bitta buyruq: paketlar -> schema'ni bazadan o'qish (faqat o'qiydi) -> generate -> serverni ko'tarish.
# Ishga tushirish:  powershell -ExecutionPolicy Bypass -File .\up.ps1
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

if (-not (Test-Path .env)) { Write-Error ".env yo'q. .env.example dan nusxa oling va API_KEY ni to'ldiring."; exit 1 }
# .env ni jarayonga yuklash (Prisma CLI ham o'qiydi, server esa process.env dan)
Get-Content .env | Where-Object { $_ -match '^\s*[^#\s][^=]*=' } | ForEach-Object {
  $k, $v = $_ -split '=', 2
  [Environment]::SetEnvironmentVariable($k.Trim(), $v.Trim().Trim('"'), 'Process')
}

if (-not (Test-Path node_modules)) { npm install }
# Eski modellarni olib tashlash (yaroqsiz bo'lsa db pull to'xtab qoladi): faqat generator + datasource qoladi
$p = 'prisma\schema.prisma'; $t = Get-Content $p -Raw; $i = $t.IndexOf('datasource db'); $j = $t.IndexOf('}', $i)
if ($i -ge 0 -and $j -gt $i) { $t.Substring(0, $j+1) | Set-Content $p -Encoding ascii }
npm run up

'@
W 'test.ps1' @'
# Ichkarida sinash: servis ishlab turgan paytda boshqa PowerShell oynasida ishga tushiring.
$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot
$env = @{}
Get-Content .env | Where-Object { $_ -match '^\s*[^#\s][^=]*=' } | ForEach-Object { $k,$v = $_ -split '=',2; $env[$k.Trim()] = $v.Trim().Trim('"') }
$base = "http://127.0.0.1:" + $(if ($env.PORT) { $env.PORT } else { "8085" })
$h = @{ "x-api-key" = $env.API_KEY }
"health: " + (Invoke-RestMethod "$base/health").ok
$m = (Invoke-RestMethod "$base/v1/models" -Headers $h).data
"modellar soni: " + $m.Count
$pref = 'Loan','LoanApplication','BaseClient','Person','PaymentTransaction'
$pick = $pref | Where-Object { $m.model -contains $_ } | Select-Object -First 1
if (-not $pick) { $pick = $m[0].model }
"namuna model: $pick"
$r = Invoke-RestMethod "$base/v1/$pick`?take=2" -Headers $h
"qaytgan yozuv: " + $r.count
$r.data | ConvertTo-Json -Depth 4 -Compress

'@
W '.env.example' @'
# Nusxa oling: .env (git'ga tushmaydi). Parol/kalitlarni FAQAT shu faylga yozing.

# Windows autentifikatsiya (109 da hozirgi foydalanuvchi bilan; hech narsa yaratish shart emas):
DATABASE_URL="sqlserver://localhost:1433;database=FlexFin;integratedSecurity=true;trustServerCertificate=true;commandTimeout=20;connectionLimit=5"
# Yoki mavjud faqat-o'qiydigan SQL login bo'lsa:
# DATABASE_URL="sqlserver://localhost:1433;database=FlexFin;user=LOGIN;password=PAROL;trustServerCertificate=true;commandTimeout=20;connectionLimit=5"

PORT=8085
HOST=0.0.0.0

# Kamida 24 belgi, tasodifiy. 21.4 shu kalitni `x-api-key` sarlavhasida yuboradi.
API_KEY=

# Faqat shu IP'lardan ruxsat (vergul bilan). 21.4 serverining IP'si:
ALLOWED_IPS=192.168.21.4

# Katta jadvallar (loglar) bloklangan. Bo'sh qoldirsangiz hammasi ochiladi.
BLOCK_MODELS=SystemLog,SystemLogValues

# Pasport/telefon/PINFL kabi ustunlar default "***" bilan yashiriladi. Kerak bo'lsa: true
EXPOSE_PII=false

'@

# --- .env (API kalit tasodifiy; faqat shu fayl ichida) ---
if (-not (Test-Path "$root\.env")) {
  $key = ([guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N'))
  $t = Get-Content "$root\.env.example" -Raw
  $t = $t -replace '(?m)^API_KEY=.*$', "API_KEY=$key"
  $t = $t -replace '(?m)^ALLOWED_IPS=.*$', 'ALLOWED_IPS=192.168.21.4,127.0.0.1'
  W ".env" $t
  Write-Host ".env yaratildi (API_KEY shu faylda)."
}

# --- Node (portable, tizimga o'rnatilmaydi) ---
$node = "$root\node"
if (-not (Test-Path "$node\node.exe")) {
  $major = [Environment]::OSVersion.Version.Major
  $ver = if ($major -ge 10) { "v22.11.0" } else { "v18.20.4" }
  $url = "https://nodejs.org/dist/$ver/node-$ver-win-x64.zip"
  Write-Host "Node yuklanadi: $url (~30 MB), $root\node ga ochiladi."
  if ((Read-Host "Davom etamizmi? (y/n)") -ne "y") { Write-Host "To'xtatildi."; return }
  $zip = "$env:TEMP\node.zip"
  Invoke-WebRequest -UseBasicParsing $url -OutFile $zip
  Expand-Archive $zip -DestinationPath "$root\_n" -Force
  Move-Item (Get-ChildItem "$root\_n" | Select-Object -First 1).FullName $node
  Remove-Item "$root\_n", $zip -Recurse -Force
}
$env:PATH = "$node;$env:PATH"
node -v

Set-Location $root
Write-Host "`nTayyor. Keyingi qadam (schema'ni bazadan o'qiydi, generate qiladi, serverni ko'taradi):"
Write-Host "  cd C:\flexfin-crm-service ; `$env:PATH = 'C:\flexfin-crm-service\node;' + `$env:PATH ; powershell -ExecutionPolicy Bypass -File .\up.ps1"
Write-Host "Sinash (boshqa PowerShell oynasida): powershell -ExecutionPolicy Bypass -File C:\flexfin-crm-service\test.ps1"
