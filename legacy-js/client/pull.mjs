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
