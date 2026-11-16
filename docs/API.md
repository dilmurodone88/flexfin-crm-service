# flexfin-crm-service: API hujjati

Interaktiv hujjat (har model uchun maydonlar, filtrlar, bog'lanishlar): **`/docs`** (Swagger UI), **`/docs-json`** (OpenAPI 3).
Ma'lumotlar modeli: [DATA-MODEL.md](DATA-MODEL.md). Hammasi **faqat GET** (boshqa metodlar 405).

## Nechta API bor

**1116 ta GET yo'l** (259 ro'yxat, 241 bitta, 241 `/full`, 241 `/graph`, 124 bola shabloni = 472 ota-bola kombinatsiya, raw, feed, meta). To'liq jadval va tushuntirish: [OVERVIEW.md](OVERVIEW.md). Mashina o'qiydigan shakl: [openapi.json](openapi.json).

## Autentifikatsiya va xavfsizlik

| Qoida | Tafsilot |
|---|---|
| Kalit | `x-api-key: <API_KEY>` (har so'rovda, `/health` dan tashqari) |
| IP | faqat `ALLOWED_IPS` ro'yxatidagi manzillar (nginx orqasida haqiqiy IP `X-Forwarded-For` dan, faqat `TRUSTED_PROXIES` dan kelsa) |
| Maxfiy ustunlar | `Password`, `PasswordSalt`, `SID`, `Hash`, token/secret bazadan **umuman o'qilmaydi** va javobda yo'q |
| Shaxsiy ma'lumot | pasport seriya/raqam, JSHSHIR, INN, telefon, tug'ilgan sana/joy, manzil, karta raqami default `***` (`EXPOSE_PII=true` bilan ochiladi). Primary key va FK ustunlari hech qachon yashirilmaydi |
| Bloklangan | `SystemLog`, `SystemLogValues` (`BLOCK_MODELS`) |
| Chegaralar | `take` ≤ 1000, parallel so'rov ≤ 8, 600 so'rov/daqiqa/IP, baza so'rovi 25 s |
| Faqat o'qish | Prisma darajasida yozish va raw SQL bloklangan; baza tomonida `sql/readonly-login.sql` tavsiya etiladi |

## Xatolar

Hamma xato bir xil shaklda: `{ "statusCode": 404, "error": "Topilmadi", "reqId": "..." }`. `reqId` = `x-request-id` (mijoz yuborsa shu qaytadi), loglardan qidirish uchun.

| Kod | Ma'nosi |
|---|---|
| 400 | noto'g'ri parametr (noma'lum maydon, tur xatosi, noto'g'ri operator) |
| 401 / 403 | kalit noto'g'ri / IP ruxsat etilmagan |
| 404 | model, yozuv yoki bog'lanish yo'q |
| 405 | GET dan boshqa metod |
| 429 | tezlik yoki parallel so'rov chegarasi |
| 503 / 504 | baza vaqtincha mavjud emas / timeout (GET bir marta o'zi qayta uriniladi) |

## Endpointlar

| URL | Nima |
|---|---|
| `GET /health` | tirikligi (kalitsiz): `{ok, service, version, models, relations, rawTables, feed}` |
| `GET /ready` | bazaga ulanish (`SELECT 1`) |
| `GET /metrics` | Prometheus |
| `GET /v1/models` | barcha modellar: `pk`, maydonlar, `references`, `referencedBy`, `rawTables` |
| `GET /v1/_graph` | bog'lanishlar grafi |
| `GET /v1/{Model}` | ro'yxat |
| `GET /v1/{Model}/{id}` | bitta yozuv |
| `GET /v1/{Model}/{id}/full` | yozuv + hamma FK ota-yozuvlar (`_expand`) + bolalarga havolalar |
| `GET /v1/{Model}/{id}/graph` | chuqur: ota zanjiri (`depth` ≤ 3, `_parents`) + `include=Bola1,Bola2` (`_children`, `childTake` ≤ 200) |
| `GET /v1/{Model}/{id}/{Child}?by=Ustun` | bog'langan bolalar |
| `GET /v1/raw`, `/v1/raw/{schema.jadval}` | primary key'siz jadvallar |
| `GET /v1/feed/changes`, `/v1/feed/latest`, `/v1/feed/stream` | o'zgarishlar (real vaqt) |
| `GET /docs`, `/docs-json` | Swagger |

### Ro'yxat parametrlari

| Parametr | Misol | Izoh |
|---|---|---|
| `take` | `take=200` | default 100, eng ko'pi 1000 |
| `after` | `after=15000` | kursor (`nextCursor` qiymati), bitta ustunli PK. **Faqat default tartib bilan** (`orderBy` bilan birga 400) |
| `orderBy` | `orderBy=OID:desc` | default PK bo'yicha o'sish |
| `select` | `select=OID,Name` | PK va expand ustunlari avtomatik qo'shiladi |
| `expand` | `expand=Client,Currency` yoki `*` | FK ota-yozuvlari `_expand` ichida (eng ko'pi 25) |
| `count` | `count=1` | `total` (katta jadvalda og'ir) |
| filtr | `Field=v`, `__gt`, `__gte`, `__lt`, `__lte`, `__contains`, `__startsWith`, `__not`, `__in=a,b`, `__isnull=true` | turi maydon turiga qarab tekshiriladi |

`GCRecord__isnull=true` = faqat o'chirilmagan yozuvlar (XPO soft-delete).

### Misollar

```bash
H='x-api-key: <KALIT>'; B=https://flexfin-crm.example.local

# faol mijozlar, 2 tadan
curl -sk -H "$H" "$B/v1/BaseClient?GCRecord__isnull=true&take=2"

# kredit + uning FinObject (meros) + mijozi bitta so'rovda
curl -sk -H "$H" "$B/v1/Loan/12345/full"

# mijozning hamma FinObject'lari
curl -sk -H "$H" "$B/v1/BaseClient/777/FinObject?by=Client"

# sahifalash
curl -sk -H "$H" "$B/v1/Loan?take=500"                 # -> nextCursor
curl -sk -H "$H" "$B/v1/Loan?take=500&after=<nextCursor>"

# primary key'siz jadval
curl -sk -H "$H" "$B/v1/raw/dbo.LoanUpdateLog?Loan=12345&take=50"
```

Javob shakli (ro'yxat): `{ "model": "Loan", "count": 100, "nextCursor": "9981", "data": [ { ... , "_expand": { "Client": { ... } } } ] }`.
`bigint` va `decimal` qiymatlar **satr** bo'lib keladi (aniqlik yo'qolmasligi uchun).

## Real vaqt va cron

FlexFin o'zi GRKI/ASOKI/DCR uchun o'zgarishlar navbatini yuritadi: `CdcCore.ChangedEntity` (`EntityId`, `EntityType`, `ChangeLsn`). Servis uni **faqat o'qiydi**.

1. **Cron / pull:** `GET /v1/feed/changes?after=<LSN>&take=500` → `{ data: [{EntityId, EntityType, Lsn}], nextAfter }`. Qaytgan partiya hamma vaqt to'liq LSN guruhlaridan iborat (hech narsa tushib qolmaydi, dublikat yo'q). Oxirgi `nextAfter` ni saqlang va keyingi chaqiriqda yuboring. Boshlash: `GET /v1/feed/latest` (hozirgi LSN) yoki `after=0x00000000000000000000` (boshidan).
2. **Real vaqt / push:** `GET /v1/feed/stream?after=now` (Server-Sent Events). Hodisalar: `change` (`id` = LSN), `ping` (har 15 s), `error`. Uzilsa brauzer/klient `Last-Event-ID` bilan qolgan joydan davom etadi. Bir vaqtda ≤ `MAX_STREAMS` oqim.
3. Iste'molchi idempotent bo'lsin (kamdan-kam qayta yetkazish mumkin). Har hodisa uchun yozuvni oling: `EntityType` ga mos model → `GET /v1/{Model}/{EntityId}/full`.

```js
// Node 20+
const es = await fetch(`${B}/v1/feed/stream?after=now`, { headers: { 'x-api-key': KEY } });
for await (const chunk of es.body) process.stdout.write(chunk); // "id: 0x...\nevent: change\ndata: {...}\n\n"
```

## Monitoring va log

- **Log:** JSON qator (pino): `reqId, method, path, params (faqat nomlari), status, ms, ip`. So'rov **qiymatlari** (pasport raqami va h.k.) va `x-api-key` hech qachon yozilmaydi. Docker: `docker compose logs -f api`; Windows: `logs/access.<sana>.log` (`LOG_FILE=true`, `LOG_RETENTION_FILES` kun saqlanadi).
- **Metrikalar** (`/metrics`): `flexfin_http_requests_total{method,route,status}`, `flexfin_http_request_duration_ms`, `flexfin_sse_streams`, `flexfin_db_transient_errors`, Node jarayon metrikalari.
- **Healthcheck:** `/health` (Docker HEALTHCHECK), `/ready` (bazaga ulanish).
