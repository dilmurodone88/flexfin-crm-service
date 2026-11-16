# flexfin-crm-service

FlexFin (SQL Server) bazasi uchun **faqat-o'qiydigan REST API**: NestJS 11 + Fastify + Prisma 6 + TypeScript (strict).

- **Hamma jadval:** 247+ model avtomatik (`/v1/{Model}`), bog'lanishlar (FK) bazadan: `expand`, `/{id}/full`, `/{id}/{Bola}`; primary key'siz jadvallar `/v1/raw/...`.
- **Real vaqt:** `/v1/feed/stream` (SSE) + `/v1/feed/changes` (kursor), FlexFin'ning `CdcCore.ChangedEntity` navbati asosida.
- **Xavfsiz:** faqat GET; Prisma darajasida yozish/raw bloklangan; parol/hash doim `***`; shaxsiy ma'lumot yashirin; API kalit + IP; tezlik cheklovi.
- **O'chmaydi:** Docker `restart` + Windows nazoratchi (`deploy/windows/`): yiqilsa, server qayta yonsa ham o'zi ko'tariladi; SSE `Last-Event-ID` bilan yo'qotishsiz davom etadi.
- **Ishonchli:** timeout + bir marta qayta urinish, graceful shutdown, `/health` `/ready` `/metrics`, JSON log (qiymatsiz, `reqId` bilan).
- **To'liq tushuntirish:** [docs/OVERVIEW.md](docs/OVERVIEW.md) (nechta API: **1116**, 259 model, 472 bog'lanish, Prisma schema).
- **Hujjat:** `/docs` (Swagger, har model uchun) va `docs/`: [ARCHITECTURE](docs/ARCHITECTURE.md) · [API](docs/API.md) · [DATA-MODEL](docs/DATA-MODEL.md) (ER) · [RELATIONS](docs/RELATIONS.md) (har model bo'yicha bog'lanishlar) · [SCHEMA](docs/SCHEMA.md) · [DEPLOY](docs/DEPLOY.md) · [OPERATIONS](docs/OPERATIONS.md) (runbook) · [SECURITY](docs/SECURITY.md) · [CHANGELOG](docs/CHANGELOG.md).
- **Docker + nginx:** HTTP/2, TLS, gzip, SSE, `docker compose up -d --build`.

```bash
npm ci && npx prisma generate
cp .env.example .env            # API_KEY, DATABASE_URL, ALLOWED_IPS
npm run start:dev               # yoki: npm run build && npm start
npm test                        # 49 test (soxta baza bilan, haqiqiy HTTP oqimi, SSE, xavfsizlik)
```

## Tuzilma

```
src/
  config/      env (zod bilan tekshiriladi: noto'g'ri sozlama bo'lsa ishga tushmaydi)
  prisma/      PrismaService + readonly.extension (yozishni to'sadi)
  catalog/     bazadan tuzilish (qat'iy SELECT'lar) - yagona raw SQL joyi
  registry/    modellar + bog'lanishlar reyestri
  data/        ro'yxat/bitta/full/bolalar/raw, so'rov parseri
  feed/        changes + SSE
  common/      auth guard, xato filtri, maskalash, request-id
  health/ metrics/ meta/
scripts/       build-docs.mjs, build-schema.cjs, gen-certs.sh
legacy-js/     avvalgi (109 da ishlayotgan) JS versiya: o'tish tugaguncha saqlanadi
```
