#!/usr/bin/env node
// Bog'lanishli (relation) Prisma schema yig'uvchi.
//   node scripts/build-schema.cjs <introspected.prisma> [schema-dump.txt] [prisma/schema.prisma]
//
// Kirish 1: `prisma db pull` natijasi (aniq turlar, @map, @@schema; bog'lanishlarsiz: relationMode="prisma").
// Kirish 2: schema-dump.txt (FK'lar). Chiqish: har bir (bitta ustunli, ota ustuni @id/@unique) FK uchun
//           ikki tomonlama @relation + @@index; noaniq (composite/takroriy) FK'lar o'tkazib yuboriladi va hisobotga yoziladi.
const fs = require('node:fs');

const key = (sch, tbl) => `${sch}.${tbl}`.toLowerCase();

function parseModels(text) {
  const lines = text.split(/\r?\n/);
  const models = [];
  let cur = null;
  lines.forEach((line, i) => {
    const open = /^model\s+(\w+)\s*\{/.exec(line);
    if (open) cur = { name: open[1], start: i, end: -1, fields: [], attrs: [], schema: 'dbo', table: open[1], ignored: false };
    else if (cur && /^\}/.test(line)) {
      cur.end = i;
      models.push(cur);
      cur = null;
    } else if (cur) {
      const t = line.trim();
      if (t.startsWith('@@')) {
        cur.attrs.push(t);
        let m;
        if ((m = /^@@schema\("([^"]+)"\)/.exec(t))) cur.schema = m[1];
        if ((m = /^@@map\("([^"]+)"\)/.exec(t))) cur.table = m[1];
        if (/^@@ignore/.test(t)) cur.ignored = true;
      } else if (t && !t.startsWith('//')) {
        const m = /^(\w+)\s+([\w]+)(\[\]|\?)?\s*(.*)$/.exec(t);
        if (m) {
          const rest = m[4] ?? '';
          const map = /@map\("([^"]+)"\)/.exec(rest);
          cur.fields.push({ name: m[1], type: m[2], list: m[3] === '[]', optional: m[3] === '?', rest, column: map ? map[1] : m[1], isId: /@id\b/.test(rest), isUnique: /@unique\b/.test(rest), ignoredField: /@ignore\b/.test(rest) });
        }
      }
    }
  });
  return models;
}

function parseDump(text) {
  const fks = [];
  let mode = '';
  for (const raw of text.split(/\r?\n/)) {
    const l = raw.trim();
    if (l === '##COLUMNS') mode = 'c';
    else if (l === '##FKS') mode = 'f';
    else if (mode === 'f') {
      const p = l.split('|');
      if (p.length >= 4) fks.push({ child: p[0].toLowerCase(), col: p[1], parent: p[2].toLowerCase(), pcol: p[3] });
    }
  }
  return fks;
}

function buildSchema(introspected, dumpText) {
  const models = parseModels(introspected);
  const byTable = new Map(models.map((m) => [key(m.schema, m.table), m]));
  const fks = parseDump(dumpText);
  const report = { added: 0, skipped: { ambiguous: 0, noModel: 0, ignored: 0, parentNotUnique: 0, noField: 0 } };

  // composite yoki bir juft jadval orasida bir nechta qator => noaniq
  const pairCount = new Map();
  for (const f of fks) pairCount.set(`${f.child}>${f.parent}`, (pairCount.get(`${f.child}>${f.parent}`) ?? 0) + 1);
  const pairCols = new Map();
  for (const f of fks) {
    const k = `${f.child}>${f.parent}`;
    pairCols.set(k, new Set([...(pairCols.get(k) ?? []), f.col]));
  }

  const extra = new Map(); // model -> { fieldsAdd: [], attrsAdd: [] }
  const get = (m) => (extra.has(m.name) ? extra.get(m.name) : (extra.set(m.name, { fields: [], attrs: [], names: new Set(m.fields.map((f) => f.name)), indexed: new Set() }), extra.get(m.name)));
  for (const m of models) {
    const e = get(m);
    for (const a of m.attrs) {
      const mm = /^@@(?:id|unique|index)\(\[(\w+)/.exec(a);
      if (mm) e.indexed.add(mm[1]);
    }
    for (const f of m.fields) if (f.isId || f.isUnique) e.indexed.add(f.name);
  }
  const uniq = (set, base) => {
    let n = base, i = 2;
    while (set.has(n)) n = `${base}${i++}`;
    set.add(n);
    return n;
  };

  for (const f of fks) {
    const pairKey = `${f.child}>${f.parent}`;
    // bir juft orasida bir necha FK: faqat ustunlari har xil va har birida bittadan bo'lsa (alohida FK) ruxsat; aniqlab bo'lmasa o'tkazamiz
    if (pairCount.get(pairKey) > 1 && pairCols.get(pairKey).size < pairCount.get(pairKey)) {
      report.skipped.ambiguous++;
      continue;
    }
    const child = byTable.get(f.child);
    const parent = byTable.get(f.parent);
    if (!child || !parent) { report.skipped.noModel++; continue; }
    if (child.ignored || parent.ignored) { report.skipped.ignored++; continue; }
    const cf = child.fields.find((x) => x.column === f.col && !x.ignoredField && !x.list);
    const pf = parent.fields.find((x) => x.column === f.pcol && !x.ignoredField && !x.list);
    if (!cf || !pf) { report.skipped.noField++; continue; }
    const parentIds = parent.fields.filter((x) => x.isId);
    const parentOk = pf.isUnique || (pf.isId && parentIds.length === 1);
    if (!parentOk) { report.skipped.parentNotUnique++; continue; }

    const ce = get(child);
    const pe = get(parent);
    const relName = `${child.name}_${cf.name}`;
    const relField = uniq(ce.names, `${cf.name}Rel`);
    const revField = uniq(pe.names, `${child.name}Via${cf.name}`);
    ce.fields.push(`  ${relField} ${parent.name}${cf.optional ? '?' : ''} @relation("${relName}", fields: [${cf.name}], references: [${pf.name}], onDelete: NoAction, onUpdate: NoAction)`);
    pe.fields.push(`  ${revField} ${child.name}[] @relation("${relName}")`);
    if (!ce.indexed.has(cf.name)) {
      ce.attrs.push(`  @@index([${cf.name}])`);
      ce.indexed.add(cf.name);
    }
    report.added++;
  }

  const out = introspected.split(/\r?\n/);
  // pastdan yuqoriga qo'shamiz: indekslar o'zgarmasin
  for (const m of [...models].sort((a, b) => b.end - a.end)) {
    const e = extra.get(m.name);
    if (!e || (!e.fields.length && !e.attrs.length)) continue;
    // maydonlar: birinchi @@ atributdan oldin; atributlar: oxirida
    const firstAttr = out.findIndex((l, i) => i > m.start && i < m.end && l.trim().startsWith('@@'));
    const insertFieldsAt = firstAttr === -1 ? m.end : firstAttr;
    const block = [...e.fields];
    if (firstAttr !== -1 || e.fields.length) {
      out.splice(m.end, 0, ...e.attrs); // oxiriga atributlar
    }
    out.splice(insertFieldsAt, 0, ...(firstAttr === -1 && e.attrs.length ? [...block, ''] : block));
  }
  let text = out.join('\n');
  if (!/relationMode\s*=/.test(text)) text = text.replace(/(provider\s*=\s*"sqlserver")/, '$1\n  relationMode = "prisma"');
  return { text, report, models: models.length };
}

module.exports = { buildSchema, parseModels, parseDump };

if (require.main === module) {
  const [inp, dump = 'schema-dump.txt', outp = 'prisma/schema.prisma'] = process.argv.slice(2);
  if (!inp) {
    console.error('Foydalanish: node scripts/build-schema.cjs <introspected.prisma> [schema-dump.txt] [chiqish]');
    process.exit(1);
  }
  const { text, report, models } = buildSchema(fs.readFileSync(inp, 'utf8'), fs.readFileSync(dump, 'utf8'));
  fs.writeFileSync(outp, text);
  console.log(`${outp}: ${models} model, ${report.added} bog'lanish qo'shildi`);
  console.log('O\'tkazib yuborilgan:', JSON.stringify(report.skipped));
}
