// schema-dump.txt (sys.* dump) dan docs/DATA-MODEL.md ni hosil qiladi: statistika, ER diagrammalar, jadval katalogi, FK ro'yxati.
//   node scripts/build-docs.mjs [schema-dump.txt] [docs/DATA-MODEL.md]
import { readFileSync, writeFileSync } from "node:fs";

const [src = "schema-dump.txt", dst = "docs/DATA-MODEL.md"] = process.argv.slice(2);
const cols = new Map(); // "sch.tbl" -> [{name, typ, nl, pk}]
const rows = new Map();
const fks = [];
let mode = "";
for (const raw of readFileSync(src, "utf8").split(/\r?\n/)) {
  const line = raw.trim();
  if (line === "##COLUMNS") { mode = "c"; continue; }
  if (line === "##FKS") { mode = "f"; continue; }
  const p = line.split("|");
  if (mode === "c" && p.length >= 8) {
    if (!cols.has(p[0])) cols.set(p[0], []);
    cols.get(p[0]).push({ name: p[2], typ: p[3], nl: p[5] === "True", pk: Number(p[6]) });
    rows.set(p[0], Number(p[7]));
  } else if (mode === "f" && p.length >= 4) fks.push({ child: p[0], col: p[1], parent: p[2], pcol: p[3] });
}

const isCdc = (t) => t.startsWith("cdc.");
const tables = [...cols.keys()].filter((t) => !isCdc(t)).sort();
const pkOf = (t) => cols.get(t).filter((c) => c.pk > 0).sort((a, b) => a.pk - b.pk).map((c) => c.name);
const fmt = (n) => n.toLocaleString("en-US").replace(/,/g, " ");
const id = (t) => t.replace(/[^A-Za-z0-9]/g, "_");

const DOMAINS = [
  ["Mijoz", ["dbo.BaseClient", "dbo.IndividualClient", "dbo.LegislativeClient", "dbo.Person", "dbo.Passport", "dbo.ContactInformation", "dbo.TelephoneNumber", "dbo.Location", "dbo.Representative", "dbo.ClientImageAttachment"]],
  ["Kredit", ["dbo.FinObject", "dbo.Loan", "dbo.LoanApplication", "dbo.LoanApplicationParticipants", "dbo.LoanCollateral", "dbo.LoanCollateralVehicle", "dbo.LoanCollateralRealEstate", "dbo.LoanClassification", "dbo.FinProduct", "dbo.LoanProduct", "Grki.LoanApplicationGrkiRegistartionNumber"]],
  ["Buxgalteriya", ["dbo.Document", "dbo.DocumentState", "dbo.Operation", "dbo.BaseAccount", "dbo.OperationalAccount", "dbo.FinObjectAccount", "dbo.BaseAccountQualifier", "dbo.FinObject", "dbo.Currency"]],
  ["To'lov", ["PMT.PaymentTransaction", "PMT.Disbursement", "dbo.Document"]],
];

let md = `# FlexFin ma'lumotlar modeli\n\n> Avtomatik hosil qilingan (\`node scripts/build-docs.mjs\`), manba: \`${src}\` (sys.* metama'lumoti). Ma'lumotning o'zi yo'q.\n\n`;
const byS = new Map();
for (const t of tables) { const s = t.split(".")[0]; byS.set(s, [...(byS.get(s) ?? []), t]); }
md += `## Umumiy\n\n- **${tables.length}** jadval (+ ${cols.size - tables.length} ta \`cdc.*\` tizim jadvali), **${tables.reduce((a, t) => a + cols.get(t).length, 0)}** ustun, **${fks.length}** foreign key, **${fmt(tables.reduce((a, t) => a + rows.get(t), 0))}** qator.\n`;
md += `- Primary key'siz jadval: **${tables.filter((t) => !pkOf(t).length).length}** ta (servis ularni \`/v1/raw/<schema.jadval>\` orqali o'qiydi).\n`;
md += `- **DevExpress XPO**: \`OID\` (bigint PK), \`GCRecord\` (soft-delete: \`GCRecord IS NOT NULL\` = o'chirilgan; filtr \`?GCRecord__isnull=true\`), \`OptimisticLockField\` (har yangilanishda oshadi).\n`;
md += `- **Merosxo'rlik (class table inheritance):** \`Loan.OID → FinObject.OID\`, \`LoanApplication.OID → FinObject.OID\`, \`IndividualClient.OID → BaseClient.OID\`: bitta obyekt bir nechta jadvalda bitta \`OID\` bilan yashaydi. \`/v1/Loan/{id}/full\` zanjirni o'zi yig'adi.\n\n`;

md += `| Schema | Jadval | Qator |\n|---|--:|--:|\n`;
for (const [s, ts] of [...byS].sort((a, b) => b[1].length - a[1].length)) md += `| ${s} | ${ts.length} | ${fmt(ts.reduce((a, t) => a + rows.get(t), 0))} |\n`;

md += `\n## Asosiy sohalar (ER)\n`;
for (const [name, set] of DOMAINS) {
  const S = new Set(set.filter((t) => cols.has(t)));
  const edges = fks.filter((f) => S.has(f.child) && S.has(f.parent));
  md += `\n### ${name}\n\n\`\`\`mermaid\nerDiagram\n`;
  for (const t of S) {
    md += `  ${id(t)} {\n`;
    for (const c of cols.get(t).filter((c) => c.pk > 0 || edges.some((e) => (e.child === t && e.col === c.name) || (e.parent === t && e.pcol === c.name))).slice(0, 8)) {
      md += `    ${c.typ.replace(/[^A-Za-z0-9]/g, "")} ${c.name.replace(/[^A-Za-z0-9_]/g, "_")}${c.pk > 0 ? " PK" : edges.some((e) => e.child === t && e.col === c.name) ? " FK" : ""}\n`;
    }
    md += `  }\n`;
  }
  for (const e of edges) md += `  ${id(e.parent)} ||--o{ ${id(e.child)} : "${e.col}"\n`;
  md += `\`\`\`\n`;
}

md += `\n## Eng ko'p ishora qilinadigan jadvallar\n\n| Jadval | Nechta FK ishora qiladi | Qator |\n|---|--:|--:|\n`;
const indeg = new Map();
for (const f of fks) indeg.set(f.parent, (indeg.get(f.parent) ?? 0) + 1);
for (const [t, n] of [...indeg].sort((a, b) => b[1] - a[1]).slice(0, 25)) md += `| ${t} | ${n} | ${fmt(rows.get(t) ?? 0)} |\n`;

md += `\n## Jadval katalogi\n`;
for (const [s, ts] of [...byS].sort()) {
  md += `\n### ${s}\n\n| Jadval | Qator | Ustun | PK | Ota jadvallar (FK) |\n|---|--:|--:|---|---|\n`;
  for (const t of ts) {
    const parents = [...new Set(fks.filter((f) => f.child === t).map((f) => `${f.col}→${f.parent.replace(/^dbo\./, "")}`))];
    md += `| ${t.slice(s.length + 1)} | ${fmt(rows.get(t))} | ${cols.get(t).length} | ${pkOf(t).join(", ") || "-"} | ${parents.join(", ")} |\n`;
  }
}
md += `\n## Barcha foreign key'lar (${fks.length})\n\n<details><summary>Ko'rsatish</summary>\n\n| Bola | Ustun | Ota | Ota ustun |\n|---|---|---|---|\n`;
for (const f of [...fks].sort((a, b) => a.child.localeCompare(b.child))) md += `| ${f.child} | ${f.col} | ${f.parent} | ${f.pcol} |\n`;
md += `\n</details>\n`;
writeFileSync(dst, md);
console.log(`${dst}: ${tables.length} jadval, ${fks.length} FK, ${(md.length / 1024).toFixed(0)} KB`);
