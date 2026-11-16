# Prisma schema (bog'lanishlari bilan)

Servis modellarni **ishga tushganda** Prisma DMMF'dan o'qiydi va bog'lanishlarni (FK) bazaning o'zidan oladi, shuning uchun schema'dagi
`@relation`lar servis ishlashi uchun shart emas. Lekin aniq, hujjatlashtirilgan, bog'lanishli schema (IDE, tiplar, kelajakdagi kod uchun) quyidagicha hosil qilinadi.

## Tayyor schema

`prisma/schema.prisma`: **288 model, 472 `@relation`**, `prisma validate` dan o'tgan. Dump'dan yig'ilgan: `node scripts/build-schema-from-dump.cjs`.
Decimal aniqligi dump'da yo'q (standart); aniq qiymatlar uchun quyidagi ikki bosqichli yo'l.

## Nima uchun ikki bosqich

- `prisma db pull` **aniq turlarni** beradi (decimal(p,s), nvarchar(n), `@map`, `@@schema`), lekin SQL Server'da FK'lar sikli sababli
  (`cyclic referential actions`) bog'lanishlar bilan `generate` yiqiladi, shuning uchun `relationMode = "prisma"` ishlatiladi (bog'lanishsiz).
- `schema-dump.txt` (sys.foreign_key_columns) **hamma 476 FK** ni beradi.
- `scripts/build-schema.cjs` ikkisini birlashtiradi: har (bitta ustunli, ota ustuni `@id`/`@unique`) FK uchun ikki tomonlama `@relation` + `@@index`.
  Noaniq (composite/takroriy) FK'lar va modelsiz jadvallar o'tkazib yuboriladi, hisobot chiqadi.

## Qadamlar

1. **109 da** (faqat o'qiydi) joriy introspektsiyani clipboard'ga oling:
   ```powershell
   Get-Content C:\flexfin-crm-service\prisma\schema.prisma -Raw | clip
   ```
2. **Mac'da:**
   ```bash
   pbpaste > prisma/introspected.prisma
   npm run schema:build -- prisma/introspected.prisma schema-dump.txt prisma/schema.prisma
   DATABASE_URL="sqlserver://x;database=x" npx prisma validate
   npm run prisma:generate
   npm test
   ```
3. Yangi bog'lanish nomlari: ota tomonda `<Ustun>Rel` (masalan `Person.PassportRel`), teskari tomonda `<Bola>Via<Ustun>` (masalan `Passport.PersonViaPassport`). **Skalyar maydonlar o'zgarmaydi** (API maydon nomlari = baza ustunlari).

> Eslatma: `Loan.OID → FinObject.OID` kabi XPO merosxo'rligi Prisma'da bir-ko'p ko'rinishida chiqadi (mantiqan bir-bir). API (`/full`) buni to'g'ri yig'adi.

## Qayta introspektsiya

Baza o'zgarsa: 109 da `prisma db pull` (faqat o'qiydi), yuqoridagi 1–2 qadamni takrorlang. `schema-dump.txt` ni yangilash: `docs/DATA-MODEL.md` ni qayta hosil qilish uchun `node scripts/build-docs.mjs`.
