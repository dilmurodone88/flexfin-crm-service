// prisma/schema.prisma (DMMF) dan statik OpenAPI (docs/openapi.json) va API sonini hisoblaydi. Avval: npm run build
//   node scripts/export-openapi.cjs [docs/openapi.json]
const fs = require('node:fs');
const { Prisma } = require('@prisma/client');
const { addModelDocs } = require('../dist/meta/openapi');
const BLOCK = new Set(['systemlog', 'systemlogvalues']);

const entries = new Map();
for (const m of Prisma.dmmf.datamodel.models) {
  const fields = new Map(m.fields.filter((f) => f.kind === 'scalar' || f.kind === 'enum').map((f) => [f.name, { name: f.name, type: f.type, isRequired: f.isRequired, isId: f.isId }]));
  const pk = m.primaryKey?.fields ?? m.fields.filter((f) => f.isId).map((f) => f.name);
  entries.set(m.name, { name: m.name, table: `${m.schema ?? 'dbo'}.${m.dbName ?? m.name}`.toLowerCase(), blocked: BLOCK.has(m.name.toLowerCase()), fields, pk, refs: new Map(), referencedBy: [] });
}
for (const m of Prisma.dmmf.datamodel.models) {
  const e = entries.get(m.name);
  for (const f of m.fields) {
    if (f.kind !== 'object' || f.isList || !f.relationFromFields?.length) continue;
    const p = entries.get(f.type);
    const col = f.relationFromFields[0];
    e.refs.set(col, { parent: p && !p.blocked ? p : null, parentName: f.type, parentColumn: f.relationToFields[0] });
    if (p && !p.blocked && !e.blocked) p.referencedBy.push({ child: e, column: col, parentColumn: f.relationToFields[0] });
  }
}
const models = [...entries.values()].filter((e) => !e.blocked);
const registry = { models: new Map(models.map((m) => [m.name.toLowerCase(), m])), childLinks: (m) => m.referencedBy.filter((r) => m.pk.length === 1 && r.parentColumn === m.pk[0]) };

const sec = [{ apiKey: [] }];
const ok = { 200: { description: 'ok' } };
const doc = {
  openapi: '3.0.3',
  info: { title: 'flexfin-crm-service', version: '2.1.1', description: "FlexFin (SQL Server) uchun faqat-o'qiydigan REST API. Barcha so'rovlar GET. Autentifikatsiya: x-api-key + IP ro'yxati." },
  security: sec,
  components: { securitySchemes: { apiKey: { type: 'apiKey', in: 'header', name: 'x-api-key' } }, schemas: {} },
  paths: {
    '/health': { get: { tags: ['health'], summary: 'Liveness (kalitsiz)', security: [], responses: ok } },
    '/ready': { get: { tags: ['health'], summary: 'Readiness (baza + katalog)', security: sec, responses: ok } },
    '/metrics': { get: { tags: ['health'], summary: 'Prometheus', security: sec, responses: ok } },
    '/v1/models': { get: { tags: ['meta'], summary: "Modellar, PK, bog'lanishlar", security: sec, responses: ok } },
    '/v1/_graph': { get: { tags: ['meta'], summary: "Bog'lanishlar grafi", security: sec, responses: ok } },
    '/v1/raw': { get: { tags: ['raw'], summary: "Primary key'siz jadvallar ro'yxati", security: sec, responses: ok } },
    '/v1/raw/{table}': { get: { tags: ['raw'], summary: "Primary key'siz jadvalni o'qish (take, skip, Ustun=qiymat)", security: sec, parameters: [{ name: 'table', in: 'path', required: true, schema: { type: 'string' } }], responses: ok } },
    '/v1/feed/changes': { get: { tags: ['feed'], summary: "O'zgarishlar (kursor, to'liq LSN guruhlari)", security: sec, responses: ok } },
    '/v1/feed/latest': { get: { tags: ['feed'], summary: "Eng so'nggi LSN", security: sec, responses: ok } },
    '/v1/feed/stream': { get: { tags: ['feed'], summary: 'Real vaqt (SSE)', security: sec, responses: ok } },
  },
};
addModelDocs(doc, registry);
fs.writeFileSync(process.argv[2] ?? 'docs/openapi.json', JSON.stringify(doc, null, 2));

const paths = Object.keys(doc.paths);
const by = (re) => paths.filter((p) => re.test(p)).length;
const single = models.filter((m) => m.pk.length === 1).length;
const stat = { modelsExposed: models.length, singlePk: single, compositeOrIgnored: models.length - single, paths: paths.length,
  list: by(/^\/v1\/[A-Za-z0-9_]+$/) - by(/^\/v1\/(models|_graph|raw)$/) , byId: by(/^\/v1\/[^/]+\/\{id\}$/), full: by(/\/full$/), graph: by(/\/graph$/), children: by(/\/\{id\}\/\{child\}$/),
  parentChildPairs: models.reduce((a, m) => a + registry.childLinks(m).length, 0), relations: models.reduce((a, m) => a + m.refs.size, 0) };
console.log(JSON.stringify(stat));
