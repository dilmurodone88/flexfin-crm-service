# flexfin-crm-service: to'liq tushuntirish

## 1. Bu nima?

FlexFin (kredit/mikromoliya tizimi, SQL Server, `FlexFin` bazasi) uchun **faqat-o'qiydigan REST API**. Maqsad: CRM va boshqa tizimlar FlexFin ma'lumotlarini
**xavfsiz, tez va bog'lanishlari bilan** olsin; bazaga hech narsa yozilmasin.

```
CRM / 21.4  ──HTTPS(HTTP/2, gzip)──▶  nginx  ──▶  flexfin-crm-service (NestJS)  ──▶  FlexFin (SQL Server, 109)
                x-api-key + IP                         faqat GET, faqat o'qish           katalog (sys.*) + Prisma
```

Hozir 109 da Docker'siz ishlayapti (Task Scheduler, o'chib-yonsa ham o'zi ko'tariladi). Docker + nginx tayyor (`docker-compose.yml`).

## 2. Nechta API bor (aniq hisob)

`docs/openapi.json` dan (har URL = bitta GET operatsiya): **1116 ta**.

| Tur | Soni | Nima |
|---|--:|---|
| Ro'yxat `GET /v1/{Model}` | 259 | filtr, saralash, sahifalash, `expand`, `select` |
| Bitta `GET /v1/{Model}/{id}` | 241 | bitta ustunli primary key |
| To'liq `/{id}/full` | 241 | yozuv + hamma ota-yozuvlar |
| Chuqur `/{id}/graph` | 241 | ota zanjiri (3 daraja) + tanlangan bolalar |
| Bolalar `/{id}/{Bola}` | 124 shablon (**472** ota-bola kombinatsiya) | masalan `/v1/Loan/{id}/LoanCollateral` |
| `raw` | 2 shablon (37 jadval) | primary key'siz jadvallar |
| Feed | 3 | `changes`, `latest`, `stream` (SSE) |
| Meta / sog'liq | 5 | `/v1/models`, `/v1/_graph`, `/health`, `/ready`, `/metrics` |

- **Modellar:** schema'da 288 jadval, ulardan 261 tasi Prisma modeli (qolgani primary key'siz, `@@ignore`), 259 tasi ochiq (`SystemLog*` bloklangan). 241 tasi bitta PK'li, 18 tasi composite PK'li.
- **Bog'lanishlar:** 472 ta (FK). Hammasi `expand`, `/full`, `/graph`, bolalar orqali ishlaydi.
- Bundan tashqari har URL'ga filtr (`Ustun__gte`, `__in`, `__contains`...), `take`, `after`, `orderBy`, `select`, `expand` parametrlari qo'shiladi: kombinatsiyalar soni amalda cheksiz.

## 3. Ma'lumotlar bazasi (qisqacha)

284 jadval (+84 CDC tizim jadvali), ~45 mln qator (loglarsiz; loglar bilan ~463 mln). Asosiy sohalar: **Mijoz** (`BaseClient`, `Person`, `Passport`...), **Kredit**
(`FinObject`, `Loan`, `LoanApplication`, `LoanCollateral`...), **Buxgalteriya** (`Document` 5.8 mln, `Operation` 11 mln, `BaseAccount`...), **To'lov** (`PMT.*`).
Baza **DevExpress XPO** asosida: `OID` (primary key), `GCRecord` (soft-delete: `?GCRecord__isnull=true` = faqat o'chirilmaganlar),
meros jadvallar (`Loan.OID → FinObject.OID`). Batafsil: [DATA-MODEL.md](DATA-MODEL.md), [RELATIONS.md](RELATIONS.md).

## 4. Prisma schema (`prisma/schema.prisma`)

- To'liq: 288 model, **472 `@relation`**, `relationMode = "prisma"` (SQL Server'da FK sikllari sababli), har FK uchun `@@index`.
- Nomlash: ota tomonda `<Ustun>Rel` (masalan `Person.PassportRel`), teskari tomonda `<Bola>Via<Ustun>` (masalan `Passport.PersonViaPassport`). Skalyar maydonlar baza ustunlari bilan bir xil (API maydon nomlari = ustun nomlari).
- Primary key'siz jadvallar `@@ignore`; `sql_variant`, `rowversion` `Unsupported(...)`.
- Hosil qilish: `node scripts/build-schema-from-dump.cjs` (dump'dan) yoki 109 dagi `prisma db pull` + `npm run schema:build` (aniq decimal aniqligi bilan). Tekshirish: `npx prisma validate`.
- Servis uchun schema'dagi `@relation`lar shart emas: u FK'larni bazadan o'zi o'qiydi (ikkalasi ham 472, o'zaro mos). Schema IDE, tiplar va hujjat uchun.

## 5. Qanday ishlaydi (so'rov yo'li)

1. nginx: TLS, `GET/HEAD` dan boshqasi 405, tezlik cheklovi, `X-Forwarded-For` yoziladi.
2. Servis: IP ro'yxati + `x-api-key` tekshiruvi; so'rov parametrlari tekshiriladi (noma'lum maydon/tur xatosi 400).
3. Prisma (faqat-o'qish klienti): `findMany/findUnique/count`. Yozish va raw SQL Prisma darajasida bloklangan.
4. Maxfiy ustunlar (`Password`...) bazadan o'qilmaydi; shaxsiy ma'lumot (pasport, JSHSHIR, telefon...) `***` (`EXPOSE_PII` bilan ochiladi).
5. Javob: `bigint`/`decimal` satr, `_expand` / `_parents` / `_children` bilan bog'langan yozuvlar, `x-request-id` sarlavhasi.

## 6. Ma'lumotni qanday olish (misollar)

```bash
H='x-api-key: <KALIT>'; B=http://192.168.3.109:8085

curl -s -H "$H" "$B/v1/BaseClient?GCRecord__isnull=true&take=5"            # faol mijozlar
curl -s -H "$H" "$B/v1/Loan/12345"                                          # id bo'yicha
curl -s -H "$H" "$B/v1/Loan/12345/full"                                     # + hamma ota-yozuvlar
curl -s -H "$H" "$B/v1/Loan/12345/graph?depth=3&include=LoanCollateral"    # chuqur
curl -s -H "$H" "$B/v1/BaseClient/777/FinObject?by=Client"                  # mijozning hamma FinObject'lari
curl -s -H "$H" "$B/v1/Loan?take=500"   # -> nextCursor;  ...&after=<nextCursor>
curl -s -H "$H" "$B/v1/raw/dbo.LoanUpdateLog?Loan=12345"                    # primary key'siz jadval
curl -sN -H "$H" "$B/v1/feed/stream?after=now"                              # real vaqt (SSE)
```

## 7. Real vaqt

FlexFin o'zi o'zgarishlar navbatini (`CdcCore.ChangedEntity`: `EntityId`, `EntityType`, `ChangeLsn`) yuritadi; servis uni faqat o'qiydi.
`/v1/feed/stream` (SSE, `Last-Event-ID` bilan uzilgandan keyin davom etadi) yoki `/v1/feed/changes?after=<LSN>` (cron). Partiyalar to'liq LSN guruhlaridan iborat: yo'qotish va dublikat yo'q.
Iste'molchi idempotent bo'lsin va vaqti-vaqti bilan `OID` bo'yicha solishtirsin (FlexFin kechikib yozishi mumkin).

## 8. Ishonchlilik va xavfsizlik

Server o'chib-yonsa, jarayon yiqilsa, baza uzilsa ham servis o'zi tiklanadi (nazoratchi, qayta urinish, katalogni qayta o'qish). 25 s baza timeout, 600 so'rov/daqiqa, parallel ≤ 8.
JSON log (so'rov qiymatlari yozilmaydi), `/metrics`. Batafsil: [OPERATIONS.md](OPERATIONS.md), [SECURITY.md](SECURITY.md), [ARCHITECTURE.md](ARCHITECTURE.md).

## 9. Fayllar xaritasi

| Fayl | Nima |
|---|---|
| `prisma/schema.prisma` | to'liq Prisma schema (bog'lanishlari bilan) |
| `docs/openapi.json` | to'liq OpenAPI 3 (1116 yo'l), Swagger/Postman'ga import qilinadi |
| `docs/API.md` | API qo'llanmasi |
| `docs/RELATIONS.md` | har model bo'yicha ota/bola bog'lanishlar va URL'lar |
| `docs/DATA-MODEL.md` | ER diagrammalar, jadval katalogi, FK ro'yxati |
| `docs/ARCHITECTURE.md`, `OPERATIONS.md`, `SECURITY.md`, `DEPLOY.md`, `SCHEMA.md`, `CHANGELOG.md` | arxitektura, ekspluatatsiya, xavfsizlik, joylashtirish, schema, o'zgarishlar |
