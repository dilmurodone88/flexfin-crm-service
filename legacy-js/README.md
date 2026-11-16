# flexfin-crm-service

FlexFin (SQL Server) bazasi uchun **faqat-o'qiydigan GET servis**. Node (framework'siz) + Prisma.
Modellar qo'lda yozilmaydi — `prisma db pull` bazadan o'zi o'qiydi, har jadval `/v1/<Model>` bo'lib ochiladi.

**Bazaga hech narsa yozilmaydi:** serverda faqat `findMany` / `findUnique` / `count` bor, boshqa metodlar chaqirilmaydi;
`db pull` esa faqat metama'lumotni o'qiydi. Login/jadval yaratilmaydi.

## 109 da ishga tushirish (Windows Server)

1. Node.js LTS (>= 20) o'rnating (Windows Server 2016+ kerak).
2. Papkani 109 ga ko'chiring (`node_modules` va `.env`siz).
3. `.env.example` → `.env` nusxa oling; `API_KEY` ga kamida 24 belgili tasodifiy kalit yozing
   (`[guid]::NewGuid().ToString('N') + [guid]::NewGuid().ToString('N')`).
4. Bitta buyruq:
   ```powershell
   powershell -ExecutionPolicy Bypass -File .\up.ps1
   ```
   Bu `npm install` (bir marta) → `prisma db pull` → `prisma generate` → server (`PORT`, default 8085).
5. Firewall: 8085 ni **faqat 21.4 (192.168.21.4)** dan oching.

## Endpointlar (hammasi `x-api-key` sarlavhasi bilan, faqat GET)

| URL | Nima |
|---|---|
| `/health` | tirikligi (kalitsiz) |
| `/v1/models` | barcha modellar, primary key va maydonlar |
| `/v1/<Model>?take=100&after=<pk>` | ro'yxat; `nextCursor` bilan sahifalash |
| `/v1/<Model>/<id>` | bitta yozuv (bitta ustunli pk) |

Filtr: `?Field=val`, `?Field__gte=`, `__gt`, `__lt`, `__lte`, `__contains`, `__startsWith`, `__not`, `__in=a,b`.
Boshqa: `select=a,b`, `orderBy=Field:desc`, `count=1` (jami son — katta jadvalda og'ir, faqat kerak bo'lsa).
Yangi yozuvlar uchun: `?Created__gte=2026-11-16T00:00:00Z` yoki `after=<oxirgi pk>`.

## Katta baza uchun himoya

- `take` ≤ 1000, parallel so'rovlar ≤ 8, so'rov vaqti `commandTimeout=20` (bog'lanish qatorida).
- `SystemLog`, `SystemLogValues` (388 mln / 28 mln qator) default bloklangan (`BLOCK_MODELS`).
- Pasport/telefon/PINFL/manzil kabi maydonlar `***` (`EXPOSE_PII=true` bilan ochiladi).
- IP ro'yxati (`ALLOWED_IPS`) + API kalit. Ichki tarmoqda HTTP; kerak bo'lsa nginx/TLS orqasiga qo'ying.

## 21.4 tomonda (cron / real vaqt)

```bash
export FLEXFIN_URL=http://192.168.3.109:8085 FLEXFIN_KEY=...
node client/pull.mjs Loan              # bir marta (cron: */1 * * * *)
node client/pull.mjs Loan --every=15   # har 15 soniyada (doimiy)
```

Natija stdout'ga JSON qator; `SINK_URL` berilsa shu servisga POST qilinadi. Holat `state-<Model>.json` da.

## Cheklovlar

- Primary key'i yo'q jadvallarni Prisma `db pull` o'tkazib yuboradi (modelga aylanmaydi).
- `after` kursor faqat bitta ustunli primary key bilan ishlaydi.
- Windows autentifikatsiya (`integratedSecurity=true`) servis ishlayotgan Windows foydalanuvchisi bilan ulanadi.
