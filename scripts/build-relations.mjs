// schema-dump.txt dan docs/RELATIONS.md: HAR MODEL uchun ota/bola bog'lanishlari va tayyor URL'lar.
//   node scripts/build-relations.mjs [schema-dump.txt] [docs/RELATIONS.md]
import { readFileSync, writeFileSync } from "node:fs";
const [src = "schema-dump.txt", dst = "docs/RELATIONS.md"] = process.argv.slice(2);
const cols = new Map(), rows = new Map(), fks = [];
let mode = "";
for (const raw of readFileSync(src, "utf8").split(/\r?\n/)) {
  const l = raw.trim();
  if (l === "##COLUMNS") { mode = "c"; continue; }
  if (l === "##FKS") { mode = "f"; continue; }
  const p = l.split("|");
  if (mode === "c" && p.length >= 8) { if (!cols.has(p[0])) cols.set(p[0], []); cols.get(p[0]).push({ name: p[2], typ: p[3], pk: Number(p[6]) }); rows.set(p[0], Number(p[7])); }
  else if (mode === "f" && p.length >= 4) fks.push({ child: p[0], col: p[1], parent: p[2], pcol: p[3] });
}
const BLOCK = /^(dbo\.)?(SystemLog|SystemLogValues|sd|systranschemas)$/i;
const tabs = [...cols.keys()].filter((t) => !t.startsWith("cdc.") && !BLOCK.test(t)).sort();
const pks = (t) => cols.get(t).filter((c) => c.pk > 0).map((c) => c.name);
const single = (t) => pks(t).length === 1;
const m = (t) => (t.startsWith("dbo.") ? t.slice(4) : t.replace(".", "_")); // Prisma dublikat nomlari: Schema_Jadval
const fmt = (n) => n.toLocaleString("en-US").replace(/,/g, " ");
const parents = new Map(), kids = new Map();
let amb = 0;
const pair = new Map();
for (const f of fks) pair.set(`${f.child}>${f.parent}`, (pair.get(`${f.child}>${f.parent}`) ?? 0) + 1);
for (const f of fks) {
  if (!tabs.includes(f.child)) continue;
  const composite = pair.get(`${f.child}>${f.parent}`) > 1 && new Set(fks.filter((x) => x.child === f.child && x.parent === f.parent).map((x) => x.col)).size < pair.get(`${f.child}>${f.parent}`);
  if (composite) { amb++; continue; }
  (parents.get(f.child) ?? parents.set(f.child, []).get(f.child)).push(f);
  if (single(f.parent) && pks(f.parent)[0] === f.pcol && single(f.child)) (kids.get(f.parent) ?? kids.set(f.parent, []).get(f.parent)).push(f);
}
let md = `# Modellar va bog'lanishlar (har model bo'yicha)\n\n> Avtomatik: \`node scripts/build-relations.mjs\` (manba: \`${src}\`). Model nomi: \`dbo\` jadvallari o'z nomi bilan, boshqa schema'larda dublikat bo'lsa \`Schema_Jadval\`.\n>\n`;
md += `> Har model uchun: **ota bog'lanishlar** (\`?expand=Ustun\`, \`/graph\`) va **bolalar** (\`/{id}/{Bola}?by=Ustun\`). Composite/noaniq FK'lar (${amb} ta) o'tkazib yuborilgan.\n\n`;
md += `## Fihrist\n\n| Model | Qator | PK | Ota | Bola |\n|---|--:|---|--:|--:|\n`;
for (const t of tabs) md += `| [${m(t)}](#${m(t).toLowerCase()}) | ${fmt(rows.get(t))} | ${pks(t).join(", ") || "yo'q (raw)"} | ${(parents.get(t) ?? []).length} | ${(kids.get(t) ?? []).length} |\n`;
for (const t of tabs) {
  const P = parents.get(t) ?? [], K = kids.get(t) ?? [];
  md += `\n## ${m(t)}\n\n\`${t}\` · ${fmt(rows.get(t))} qator · PK: ${pks(t).join(", ") || "yo'q"} · ${cols.get(t).length} ustun\n\n`;
  if (!single(t)) { md += `Bitta ustunli PK yo'q: ${pks(t).length ? "composite PK, ro'yxat orqali filtr" : "faqat \`/v1/raw/" + t + "\`"}.\n`; continue; }
  const id = pks(t)[0];
  md += `\`GET /v1/${m(t)}\` · \`GET /v1/${m(t)}/{${id}}\` · \`/{id}/full\` · \`/{id}/graph?depth=3\`\n`;
  if (P.length) { md += `\n**Ota (expand):**\n\n| Ustun | → Ota | Ota ustun |\n|---|---|---|\n`; for (const f of P) md += `| \`${f.col}\` | [${m(f.parent)}](#${m(f.parent).toLowerCase()}) | ${f.pcol} |\n`; md += `\nMisol: \`/v1/${m(t)}?expand=${P[0].col}\`\n`; }
  if (K.length) { md += `\n**Bolalar:**\n\n| Bola | Ustun | URL |\n|---|---|---|\n`; for (const f of K) md += `| [${m(f.child)}](#${m(f.child).toLowerCase()}) | \`${f.col}\` | \`/v1/${m(t)}/{id}/${m(f.child)}?by=${f.col}\` |\n`; }
  if (!P.length && !K.length) md += `\nBog'lanishlari yo'q (mustaqil jadval).\n`;
}
writeFileSync(dst, md);
console.log(`${dst}: ${tabs.length} model, ${(md.length / 1024).toFixed(0)} KB, noaniq FK: ${amb}`);
