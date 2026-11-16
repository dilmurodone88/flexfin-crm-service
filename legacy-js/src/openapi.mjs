// Ochiq modellardan OpenAPI 3 hujjati: GET /v1/openapi.json
const T = {
  Int: { type: "integer" },
  BigInt: { type: "string", description: "bigint (JSON'da satr)" },
  Float: { type: "number" },
  Decimal: { type: "string", description: "decimal (aniqlik yo'qolmasligi uchun satr)" },
  Boolean: { type: "boolean" },
  DateTime: { type: "string", format: "date-time" },
  String: { type: "string" },
  Bytes: { type: "string", description: "[binary]" },
};

export function buildOpenApi(models, { version = "1.0.0" } = {}) {
  const schemas = {};
  const paths = {
    "/health": { get: { summary: "Tirikligi", security: [], responses: { 200: { description: "ok" } } } },
    "/ready": { get: { summary: "Tayyorligi (bazaga ulanish)", responses: { 200: { description: "ok" }, 503: { description: "baza yo'q" } } } },
    "/v1/models": { get: { summary: "Modellar, primary key va bog'lanishlar", responses: { 200: { description: "ok" } } } },
    "/v1/feed/changes": { get: { summary: "O'zgarishlar (CdcCore.ChangedEntity), LSN kursori", parameters: [{ name: "after", in: "query", schema: { type: "string" } }, { name: "take", in: "query", schema: { type: "integer" } }], responses: { 200: { description: "ok" } } } },
    "/v1/feed/stream": { get: { summary: "Real vaqt (Server-Sent Events)", parameters: [{ name: "after", in: "query", schema: { type: "string" }, description: "LSN | now | 0" }], responses: { 200: { description: "text/event-stream" } } } },
  };
  const listParams = [
    { name: "take", in: "query", schema: { type: "integer", maximum: 1000 } },
    { name: "after", in: "query", schema: { type: "string" }, description: "primary key kursori" },
    { name: "orderBy", in: "query", schema: { type: "string" }, description: "maydon:asc|desc" },
    { name: "select", in: "query", schema: { type: "string" } },
    { name: "expand", in: "query", schema: { type: "string" }, description: "FK ustunlari (vergul bilan) yoki *" },
  ];
  for (const m of models) {
    schemas[m.name] = {
      type: "object",
      properties: Object.fromEntries([...m.fields].map(([n, f]) => [n, { ...(T[f.type] ?? { type: "string" }), nullable: !f.isRequired }])),
    };
    paths[`/v1/${m.name}`] = {
      get: {
        summary: `${m.name} ro'yxati`,
        parameters: listParams,
        responses: { 200: { description: "ok", content: { "application/json": { schema: { type: "object", properties: { data: { type: "array", items: { $ref: `#/components/schemas/${m.name}` } } } } } } } },
      },
    };
    if (m.pk.length === 1) {
      paths[`/v1/${m.name}/{id}`] = {
        get: { summary: `${m.name} bitta`, parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "ok" }, 404: { description: "topilmadi" } } },
      };
      paths[`/v1/${m.name}/{id}/full`] = {
        get: { summary: `${m.name} to'liq (FK ota-yozuvlar bilan)`, parameters: [{ name: "id", in: "path", required: true, schema: { type: "string" } }], responses: { 200: { description: "ok" } } },
      };
    }
  }
  return {
    openapi: "3.0.3",
    info: { title: "flexfin-crm-service", version, description: "FlexFin bazasi uchun faqat-o'qiydigan REST API" },
    security: [{ apiKey: [] }],
    components: { securitySchemes: { apiKey: { type: "apiKey", in: "header", name: "x-api-key" } }, schemas },
    paths,
  };
}
