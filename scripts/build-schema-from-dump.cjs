#!/usr/bin/env node
// To'liq bog'lanishli prisma/schema.prisma ni schema-dump.txt dan yig'adi (baza bilan ulanishsiz).
//   node scripts/build-schema-from-dump.cjs [schema-dump.txt] [prisma/schema.prisma]
// Dump: ##COLUMNS jadval|id|ustun|tur|uzunlik|nullable|pk|qator  ##FKS bola|ustun|ota|ota-ustun
const fs = require('node:fs');
const [src = 'schema-dump.txt', dst = 'prisma/schema.prisma'] = process.argv.slice(2);

const tables = new Map();
const fks = [];
let mode = '';
for (const raw of fs.readFileSync(src, 'utf8').split(/\r?\n/)) {
  const l = raw.trim();
  if (l === '##COLUMNS') { mode = 'c'; continue; }
  if (l === '##FKS') { mode = 'f'; continue; }
  const p = l.split('|');
  if (mode === 'c' && p.length >= 8) {
    if (!tables.has(p[0])) { const [sch, ...r] = p[0].split('.'); tables.set(p[0], { key: p[0], sch, tbl: r.join('.'), cols: [] }); }
    tables.get(p[0]).cols.push({ name: p[2], typ: p[3], ml: Number(p[4]), nl: p[5] === 'True', pk: Number(p[6]) });
  } else if (mode === 'f' && p.length >= 4) fks.push({ child: p[0], col: p[1], parent: p[2], pcol: p[3] });
}
const list = [...tables.values()].filter((t) => t.sch.toLowerCase() !== 'cdc').sort((a, b) => a.key.localeCompare(b.key));

// ---- nomlar ----
const RESERVED = new Set(['String', 'Boolean', 'Int', 'BigInt', 'Float', 'Decimal', 'DateTime', 'Json', 'Bytes', 'Unsupported', 'model', 'enum', 'type', 'generator', 'datasource', 'view']);
const ident = (s) => { let n = s.replace(/[^A-Za-z0-9_]/g, '_'); if (/^[0-9_]/.test(n)) n = 'f' + n; return n; };
const count = new Map();
for (const t of list) count.set(t.tbl.toLowerCase(), (count.get(t.tbl.toLowerCase()) ?? 0) + 1);
for (const t of list) {
  let n = ident(count.get(t.tbl.toLowerCase()) > 1 && t.sch !== 'dbo' ? `${t.sch}_${t.tbl}` : t.tbl);
  if (RESERVED.has(n)) n = `${n}_`;
  t.model = n;
}
const used = new Set();
for (const t of list) { while (used.has(t.model.toLowerCase())) t.model += '_'; used.add(t.model.toLowerCase()); }

// ---- turlar ----
function typeOf(c) {
  const len = (n) => (n === -1 ? 'Max' : String(n));
  switch (c.typ) {
    case 'bigint': return ['BigInt', ''];
    case 'int': return ['Int', ''];
    case 'smallint': return ['Int', ' @db.SmallInt'];
    case 'tinyint': return ['Int', ' @db.TinyInt'];
    case 'bit': return ['Boolean', ''];
    case 'decimal': case 'numeric': return ['Decimal', ''];
    case 'money': return ['Decimal', ' @db.Money'];
    case 'smallmoney': return ['Decimal', ' @db.SmallMoney'];
    case 'float': return ['Float', ''];
    case 'real': return ['Float', ' @db.Real'];
    case 'datetime': return ['DateTime', ' @db.DateTime'];
    case 'smalldatetime': return ['DateTime', ' @db.SmallDateTime'];
    case 'datetime2': return ['DateTime', ' @db.DateTime2'];
    case 'datetimeoffset': return ['DateTime', ' @db.DateTimeOffset'];
    case 'date': return ['DateTime', ' @db.Date'];
    case 'time': return ['DateTime', ' @db.Time'];
    case 'nvarchar': return ['String', ` @db.NVarChar(${c.ml === -1 ? 'Max' : c.ml / 2})`];
    case 'nchar': return ['String', ` @db.NChar(${c.ml / 2})`];
    case 'varchar': return ['String', ` @db.VarChar(${len(c.ml)})`];
    case 'char': return ['String', ` @db.Char(${c.ml})`];
    case 'uniqueidentifier': return ['String', ' @db.UniqueIdentifier'];
    case 'xml': return ['String', ' @db.Xml'];
    case 'text': return ['String', ' @db.Text'];
    case 'ntext': return ['String', ' @db.NText'];
    case 'varbinary': return ['Bytes', ` @db.VarBinary(${len(c.ml)})`];
    case 'binary': return ['Bytes', ` @db.Binary(${c.ml})`];
    case 'image': return ['Bytes', ' @db.Image'];
    default: return [`Unsupported("${c.typ}")`, '', true]; // sql_variant, geography, rowversion...
  }
}

// ---- bog'lanishlar ----
const byKey = new Map(list.map((t) => [t.key, t]));
const pkCols = (t) => t.cols.filter((c) => c.pk > 0).sort((a, b) => a.pk - b.pk);
const pair = new Map();
for (const f of fks) pair.set(`${f.child}>${f.parent}`, (pair.get(`${f.child}>${f.parent}`) ?? 0) + 1);
const rel = new Map(); // key -> {fields:[], attrs:[], names:Set}
const slot = (t) => rel.get(t.key) ?? rel.set(t.key, { fields: [], attrs: [], names: new Set(t.cols.map((c) => ident(c.name))), indexed: new Set(pkCols(t).map((c) => c.name)) }).get(t.key);
const stats = { added: 0, ambiguous: 0, noParent: 0, parentNotPk: 0, childIgnored: 0 };
for (const f of fks) {
  const child = byKey.get(f.child), parent = byKey.get(f.parent);
  if (!child || !parent) { stats.noParent++; continue; }
  const sameCols = new Set(fks.filter((x) => x.child === f.child && x.parent === f.parent).map((x) => x.col));
  if (pair.get(`${f.child}>${f.parent}`) > 1 && sameCols.size < pair.get(`${f.child}>${f.parent}`)) { stats.ambiguous++; continue; }
  const ppk = pkCols(parent);
  if (ppk.length !== 1 || ppk[0].name !== f.pcol) { stats.parentNotPk++; continue; }
  if (!pkCols(child).length) { stats.childIgnored++; continue; } // @@ignore modelga bog'lanmaydi
  const cc = child.cols.find((c) => c.name === f.col);
  if (!cc || typeOf(cc)[2]) continue;
  const cs = slot(child), ps = slot(parent);
  const sc = ident(f.col);
  const base = `${sc}Rel`; let rn = base, i = 2; while (cs.names.has(rn)) rn = `${base}${i++}`; cs.names.add(rn);
  const rv0 = `${child.model}Via${sc}`; let rv = rv0; i = 2; while (ps.names.has(rv)) rv = `${rv0}${i++}`; ps.names.add(rv);
  const name = `${child.model}_${sc}`;
  cs.fields.push(`  ${rn} ${parent.model}${cc.nl ? '?' : ''} @relation("${name}", fields: [${sc}], references: [${ident(f.pcol)}], onDelete: NoAction, onUpdate: NoAction)`);
  ps.fields.push(`  ${rv} ${child.model}[] @relation("${name}")`);
  if (!cs.indexed.has(f.col)) { cs.attrs.push(`  @@index([${sc}])`); cs.indexed.add(f.col); }
  stats.added++;
}

// ---- yozish ----
const schemas = [...new Set(list.map((t) => t.sch))].sort();
let out = `// flexfin-crm-service: FlexFin bazasining TO'LIQ Prisma schema'si (bog'lanishlari bilan).
// Manba: schema-dump.txt (sys.* metama'lumoti): ${list.length} jadval, ${stats.added} ta @relation.
// Yig'ildi: node scripts/build-schema-from-dump.cjs  (baza bilan ulanishsiz).
//
// ESLATMA: decimal(p,s) aniqligi dump'da yo'q, shuning uchun Decimal standart aniqlikda. O'qish uchun farqi yo'q;
// aniq qiymatlar kerak bo'lsa: 109 da \`prisma db pull\` + \`npm run schema:build\` (docs/SCHEMA.md).
// Primary key'siz jadvallar @@ignore (Prisma ularni modelga aylantirmaydi): servis ularni /v1/raw orqali o'qiydi.
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider     = "sqlserver"
  url          = env("DATABASE_URL")
  relationMode = "prisma"
  schemas      = [${schemas.map((s) => `"${s}"`).join(', ')}]
}
`;
for (const t of list) {
  const pk = pkCols(t);
  const r = rel.get(t.key);
  out += `\nmodel ${t.model} {\n`;
  for (const c of t.cols) {
    const [ty, native, unsup] = typeOf(c);
    const n = ident(c.name);
    const map = n !== c.name ? ` @map("${c.name}")` : '';
    const id = pk.length === 1 && pk[0].name === c.name ? ' @id' : '';
    out += `  ${n} ${ty}${c.nl && !id ? '?' : ''}${id}${native}${map}\n`;
  }
  if (r) out += r.fields.join('\n') + (r.fields.length ? '\n' : '');
  out += '\n';
  if (pk.length > 1) out += `  @@id([${pk.map((c) => ident(c.name)).join(', ')}])\n`;
  if (!pk.length) out += `  @@ignore\n`;
  if (r) out += r.attrs.join('\n') + (r.attrs.length ? '\n' : '');
  if (t.model !== t.tbl) out += `  @@map("${t.tbl}")\n`;
  out += `  @@schema("${t.sch}")\n}\n`;
}
fs.writeFileSync(dst, out);
console.log(`${dst}: ${list.length} model, ${stats.added} bog'lanish, o'tkazib yuborilgan: ${JSON.stringify(stats)}`);
