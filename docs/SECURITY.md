# Xavfsizlik

| Xavf | Himoya |
|---|---|
| Bazani o'zgartirish | faqat GET (nginx 405, controller); Prisma extension yozish/`$executeRaw`/`$queryRaw`/`$transaction` ni to'sadi (testlangan); raw SELECT'lar `assertSelect`dan o'tadi; tavsiya: `db_datareader` login (`sql/readonly-login.sql`) |
| SQL in'yeksiya | qiymatlar parametr (`@P1`); identifikatorlar faqat `sys.*` katalogidan va `[..]` bilan; testlangan |
| Parol/hash sizishi | `Password`, `PasswordSalt`, `SID`, `Hash`, token/secret ustunlari so'rovdan chiqarib tashlanadi (Prisma `omit`); `select=Password` ham o'qimaydi |
| Shaxsiy ma'lumot | pasport, JSHSHIR, INN, telefon, tug'ilgan sana/joy, manzil, karta default `***`; `EXPOSE_PII=true` bilan ochiladi; PK/FK hech qachon yashirilmaydi |
| Ruxsatsiz kirish | `x-api-key` (vaqt bo'yicha doimiy solishtirish) + IP ro'yxati; `/docs` faqat ruxsat etilgan IP'lardan |
| IP soxtalashtirish | `X-Forwarded-For` faqat `TRUSTED_PROXIES` dan kelsa ishonchli; nginx uni **yozadi** (qo'shmaydi) |
| DoS / yuk | `take` ≤ 1000, parallel ≤ 8, SSE ≤ 10, 600/min/IP (+ nginx `limit_req`), 25 s baza timeout, so'rov hajmi 1 KB |
| Log orqali sizish | so'rov qiymatlari va kalit logga yozilmaydi (faqat parametr nomlari) |
| Konteyner | `read_only`, `cap_drop: ALL`, `no-new-privileges`, non-root, 512 MB |
| Transport | TLS 1.2/1.3, HSTS; ichki tarmoqda o'z-o'zidan imzolangan sertifikat (ishlab chiqarishda kompaniya CA) |

**Tavsiya etiladigan qolgan ishlar:** faqat-o'qiydigan SQL login; `API_KEY` ni muntazam almashtirish (`openssl rand -hex 32`); kompaniya CA sertifikati.
