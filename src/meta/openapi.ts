import type { OpenAPIObject } from '@nestjs/swagger';
import { RegistryService } from '../registry/registry.service';

const T: Record<string, Record<string, unknown>> = {
  Int: { type: 'integer' },
  BigInt: { type: 'string', description: "bigint (JSON'da satr)" },
  Float: { type: 'number' },
  Decimal: { type: 'string', description: 'decimal (aniqlik yo‘qolmasligi uchun satr)' },
  Boolean: { type: 'boolean' },
  DateTime: { type: 'string', format: 'date-time' },
  String: { type: 'string' },
  Bytes: { type: 'string', description: '[binary]' },
};

/** Har model uchun aniq hujjat: maydonlar, filtr parametrlari, bog'lanishlar. */
export function addModelDocs(doc: OpenAPIObject, registry: RegistryService): void {
  doc.components ??= {};
  doc.components.schemas ??= {};
  for (const m of registry.models.values()) {
    const props = Object.fromEntries(
      [...m.fields.values()].map((f) => [f.name, { ...(T[f.type] ?? { type: 'string' }), nullable: !f.isRequired }]),
    );
    (doc.components.schemas as any)[m.name] = {
      type: 'object',
      properties: props,
      description: `Jadval: ${m.table}. PK: ${m.pk.join(', ') || "yo'q"}`,
    };
    const refs = [...m.refs].map(([c, r]) => `- \`${c}\` → ${r.parent ? r.parent.name : r.parentName}.${r.parentColumn}`).join('\n');
    const kids = m.referencedBy.map((r) => `- ${r.child.name}.${r.column}`).join('\n');
    const description = [
      `Jadval \`${m.table}\`.`,
      refs && `**Ota bog'lanishlar (expand=):**\n${refs}`,
      kids && `**Bolalar (/{id}/{Child}):**\n${kids}`,
    ]
      .filter(Boolean)
      .join('\n\n');
    const filters = [...m.fields.values()].slice(0, 60).map((f) => ({
      name: f.name,
      in: 'query',
      required: false,
      description: 'Filtr: =, __gt, __gte, __lt, __lte, __contains, __startsWith, __not, __in, __isnull',
      schema: T[f.type] ?? { type: 'string' },
    }));
    const common = [
      { name: 'take', in: 'query', required: false, schema: { type: 'integer', maximum: 1000 } },
      { name: 'after', in: 'query', required: false, schema: { type: 'string' }, description: 'nextCursor' },
      { name: 'orderBy', in: 'query', required: false, schema: { type: 'string' }, description: 'maydon:asc|desc' },
      { name: 'select', in: 'query', required: false, schema: { type: 'string' } },
      { name: 'expand', in: 'query', required: false, schema: { type: 'string' }, description: [...m.refs.keys()].join(', ') || "yo'q" },
    ];
    (doc.paths as any)[`/v1/${m.name}`] = {
      get: {
        tags: ['models'],
        summary: `${m.name}: ro'yxat`,
        description,
        security: [{ apiKey: [] }],
        parameters: [...common, ...filters],
        responses: {
          200: {
            description: 'ok',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    model: { type: 'string' },
                    count: { type: 'integer' },
                    nextCursor: { type: 'string' },
                    data: { type: 'array', items: { $ref: `#/components/schemas/${m.name}` } },
                  },
                },
              },
            },
          },
        },
      },
    };
    if (m.pk.length === 1) {
      const kids = registry.childLinks(m);
      if (kids.length) {
        (doc.paths as any)[`/v1/${m.name}/{id}/{child}`] = {
          get: {
            tags: ['models'],
            summary: `${m.name}: bog'langan bolalar`,
            description: kids.map((k) => `- \`${k.child.name}\` (by=${k.column})`).join('\n'),
            security: [{ apiKey: [] }],
            parameters: [
              { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
              { name: 'child', in: 'path', required: true, schema: { type: 'string', enum: [...new Set(kids.map((k) => k.child.name))] } },
              { name: 'by', in: 'query', required: false, schema: { type: 'string' }, description: 'bir nechta bog\'lanish bo\'lsa ustun nomi' },
            ],
            responses: { 200: { description: 'ok' }, 404: { description: "bog'lanish yo'q" } },
          },
        };
      }
      (doc.paths as any)[`/v1/${m.name}/{id}`] = {
        get: {
          tags: ['models'],
          summary: `${m.name}: bitta`,
          security: [{ apiKey: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }, common[4]],
          responses: { 200: { description: 'ok' }, 404: { description: 'topilmadi' } },
        },
      };
      (doc.paths as any)[`/v1/${m.name}/{id}/graph`] = {
        get: {
          tags: ['models'],
          summary: `${m.name}: chuqur ko'rinish (ota zanjiri + bolalar)`,
          description: "depth ≤ 3 (FK bo'ylab ota-yozuvlar `_parents`), include=Bola1,Bola2 (≤ 8, `_children`), childTake ≤ 200. ≤ 150 baza so'rovi.",
          security: [{ apiKey: [] }],
          parameters: [
            { name: 'id', in: 'path', required: true, schema: { type: 'string' } },
            { name: 'depth', in: 'query', required: false, schema: { type: 'integer', maximum: 3, default: 2 } },
            { name: 'include', in: 'query', required: false, schema: { type: 'string' }, description: registry.childLinks(m).map((k) => k.child.name).join(', ') || "yo'q" },
            { name: 'childTake', in: 'query', required: false, schema: { type: 'integer', maximum: 200, default: 20 } },
          ],
          responses: { 200: { description: 'ok' }, 404: { description: 'topilmadi' } },
        },
      };
      (doc.paths as any)[`/v1/${m.name}/{id}/full`] = {
        get: {
          tags: ['models'],
          summary: `${m.name}: to'liq (FK ota-yozuvlar bilan)`,
          security: [{ apiKey: [] }],
          parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
          responses: { 200: { description: 'ok' } },
        },
      };
    }
  }
}
