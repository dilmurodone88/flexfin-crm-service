# Arxitektura

```mermaid
flowchart LR
  C[Mijoz: 21.4 / CRM] -->|HTTPS, HTTP/2, x-api-key| N[nginx: TLS, gzip, limit_req, GET-only]
  N -->|X-Forwarded-For (yoziladi)| A[flexfin-crm-service: NestJS + Fastify]
  A -->|Prisma read-only| DB[(FlexFin SQL Server)]
  A -->|qat'iy SELECT| DB
  A -->|SSE / cursor| C
  A -.->|/metrics| P[Prometheus]
  A -.->|JSON log| L[(docker logs / logs/*.log)]
```

## So'rov yo'li

`nginx` (TLS, 405 if not GET, tezlik) → Fastify (`x-request-id`, gzip o'chiq: nginx siqadi) → **ThrottlerGuard/AuthGuard** (IP + kalit) →
Controller → Service → `PrismaService.run()` (25 s timeout, 1 marta qayta urinish) → Prisma (`readonly.extension`) → SQL Server →
`MaskingService` → JSON (`bigint`/`decimal` satr) → `AllExceptionsFilter` (xato shakli `{statusCode,error,reqId}`).

## Modullar

| Papka | Vazifa |
|---|---|
| `config/` | env (zod): noto'g'ri sozlamada ishga tushmaydi |
| `prisma/` | `PrismaService`: `base` (faqat katalog/feed SELECT'lari uchun), `db` (faqat-o'qish; yozish/raw/transaction taqiqlangan), `run()` |
| `catalog/` | bazadan tuzilish (jadval, ustun, FK) va primary key'siz jadvallarni o'qish. Raw SQL'ning yagona joyi (`assertSelect`: faqat SELECT, `;`/izoh yo'q, identifikatorlar katalogdan, qiymatlar `@P1`) |
| `registry/` | modellar (Prisma DMMF) + bog'lanishlar + raw jadvallar + feed. Katalog o'qilmasa 2..60 s da qayta uriniladi |
| `data/` | ro'yxat / bitta / `full` / bolalar / `raw`, so'rov parseri (`query.ts`) |
| `feed/` | `changes` (kursor) va SSE |
| `common/` | `AuthGuard`, `MaskingService`, xato filtri, `request-id`, `client-ip` |
| `health/`, `metrics/`, `meta/` | `/health` `/ready`, `/metrics`, `/v1/models` `/v1/_graph`, OpenAPI |

## Muhim qarorlar

1. **Modellar dinamik** (DMMF + katalog): baza o'zgarsa kodni emas, schema'ni yangilash yetadi (docs/SCHEMA.md).
2. **Faqat o'qish ko'p qatlamli:** nginx (405) → controller (faqat `@Get`) → Prisma extension (yozish/raw taqiq) → `assertSelect` → (tavsiya) baza loginida `db_datareader`.
3. **Maxfiy ustunlar bazadan o'qilmaydi** (`omit`), shaxsiy ma'lumot esa o'qilib `***` bilan yashiriladi (`EXPOSE_PII`).
4. **Bog'lanishlar bazadan:** schema'dagi `@relation`lar shart emas; servis FK'larni `sys.foreign_key_columns` dan oladi (composite FK'lar noaniq: o'tkazib yuboriladi).
5. **Feed to'liq LSN guruhlari bilan** sahifalanadi: partiya hech qachon guruh o'rtasida kesilmaydi (yo'qotish/dublikat yo'q).
6. **Kursor faqat PK tartibida:** `orderBy` bilan `after` rad etiladi (qator sakrashi oldini oladi).
7. **XPO merosi:** `Loan.OID → FinObject.OID`; `/full` zanjirni `expand` bilan yig'adi.

## Cheklovlar (ochiq aytiladi)

- Feed manbasi (`CdcCore.ChangedEntity`) FlexFin'ning o'zi to'ldiradi. Agar u ilgari o'qilgan LSN'dan **kichik** LSN bilan keyin yozsa, kursor ularni ko'rmaydi. Iste'molchi idempotent bo'lsin va vaqti-vaqti bilan `OID` bo'yicha solishtirsin (reconcile).
- Composite FK'lar va primary key'siz jadvallar orasidagi bog'lanishlar yo'q (raw jadvalda `Ustun=qiymat` filtr bor).
- `sql_variant`, `geography`, `hierarchyid` ustunlari faqat raw'da matn sifatida.
