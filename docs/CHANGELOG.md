# O'zgarishlar

## 2.0.1 (review tuzatishlari)
- **Feed:** LSN guruhi partiya o'rtasida kesilmaydi (qatorlar yo'qolmaydi, dublikat yo'q); tartib `(LSN, EntityType, EntityId)`.
- **Katalog:** o'qilmasa 2..60 s da qayta uriniladi; `/ready` va `/health.catalog` holatni ko'rsatadi; `applyCatalog` idempotent.
- **Raw:** barqaror tartib (birinchi 8 tartiblanadigan ustun); binary ustunlar hex emas, hajmi (`[binary N bayt]`).
- **Sahifalash:** `orderBy` bilan `after` rad etiladi, `nextCursor` faqat PK tartibida.
- **SSE:** oqim joyi darhol band qilinadi (MAX_STREAMS poygasi yo'q).
- **Tezlik:** `expand`/`/full` ustunlari parallel so'raladi.
- **Xavfsizlik:** maxfiy ustunlar Prisma `omit` bilan bazadan o'qilmaydi (ustun-`DENY` bilan mos).
- **Log:** haqiqiy mijoz IP'si (`TRUSTED_PROXIES` orqali). **Metrika:** o'lik gauge olib tashlandi.
- **Windows:** nazoratchi (`run.ps1`) + har 5 daqiqada tekshiruv + ixtiyoriy firewall qoidasi.

## 2.0.0
- NestJS + TypeScript qayta yozuv, bog'lanishlar, SSE feed, Swagger, Docker + nginx, hujjatlar.
