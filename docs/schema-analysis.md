# FlexFin bazasi tahlili (2026-11-16)

Manba: `FlexFin` (SQL Server, 109), `sys.*` metama'lumoti: 372 jadval, 3750 ustun, 476 foreign key, ~463 mln qator.
Ma'lumot qatorlarining o'zi ko'chirilmagan, faqat tuzilish va qatorlar soni.

## 1. Umumiy tuzilma

- **Framework: DevExpress XPO.** 277 jadvalda `OID` (bigint primary key), 156 tasida `GCRecord` (soft-delete belgisi).
  `GCRecord IS NOT NULL` = o'chirilgan yozuv (`dbo.XPDeletedObject` ga 132 ta FK ishora qiladi).
  `OptimisticLockField` har yangilanishda oshadi.
- **Merosxo'rlik jadvallar bo'yicha (class table inheritance):**
  `FinObject` (37 251) ← `Loan` (15 738), `LoanApplication` (21 398), `Factoring`, `Share`, `CustomFinObject`;
  `BaseClient` (19 216) ← `IndividualClient` (19 180), `LegislativeClient` (33).
  Ya'ni kredit = `FinObject.OID = Loan.OID = LoanApplication.OID`.
- **Hajm bo'yicha ikkita dunyo:** haqiqiy biznes ma'lumot kichik (~50 mln qator), qolgani log va buxgalteriya.

| Soha | Asosiy jadvallar | Qator |
|---|---|---|
| Mijoz | `BaseClient`, `Person`, `IndividualClient`, `Passport`, `ContactInformation`, `TelephoneNumber`, `Location` | 19-44 ming |
| Kredit | `LoanApplication`, `Loan`, `LoanCollateral*` (+Vehicle, RealEstate...), `LoanClassification` | 15-21 ming |
| To'lov | `PMT.PaymentTransaction`, `PMT.Disbursement` | 73 776 / 67 |
| Buxgalteriya | `Document` (5.8 mln), `Operation` (11.2 mln), `DocumentState` (6.5 mln), `BaseAccount`/`OperationalAccount` (508 ming), `TurnoverAndBalanceCacheWithQualifier` (10.7 mln) | katta |
| Hisobot/integratsiya | `CBReport.*`, `Grki.*`, `Crif`, `DCR.*`, `Affiliation.*`, `DebtCollector.ClientBinding` | kichik |
| Audit/log | `SystemLog` (28.8 mln), `SystemLogValues` (388.6 mln), `LoanUpdateLog` (166 ming), `LegalisationInfo` (535 ming) | juda katta |
| CDC | `cdc.*` (84 jadval, 600 qator), `CdcCore.ChangedEntity` (14 014) | kichik |

Eng ko'p ishora qilinadigan jadvallar: `BaseClient` (22 FK), `BaseAccountQualifier` (18), `FinObject` (12), `FinProduct` (12), `OperationalAccount` (10), `LoanCollateral` (10).

## 2. Xavfsizlik topilmalari (muhim)

1. **`dbo.isUser`** (142 yozuv): `Password`, `PasswordSalt`, `SID`, `KeycloakUserId`. Boshqa: `dbo.Cert.Hash`.
   Servis hamma modelni ochgani uchun bular GET orqali chiqishi mumkin edi. **Tuzatildi:** bunday ustunlar endi
   har doim `***` (`EXPOSE_PII` ga bog'liq emas).
2. Shaxsiy ma'lumot: `Passport.Series/Number`, `Person.PersonalCitizenCode` (JSHSHIR), `Person.BirthDate/BirthPlace`,
   `BaseClient.TaxCode` (INN), `TelephoneNumber.Number`, `Location.Address`, `BaseClient.PaymentCardNumber`,
   `IdentificationTelephoneNumber`; rasmlar `Person.Photo/Signature`, `ClientImageAttachment.Image` (binary, `[binary]`).
   Default yashiriladi (`EXPOSE_PII=true` bilan ochiladi). Mijoz ismlari ochiq qoldirilgan (CRM uchun kerak).
3. Servis hozir Windows `Администратор` bilan ulanadi. Kod yozishni to'sadi, lekin baza tomonidan himoya yo'q.
   Tavsiya: alohida `db_datareader` login.

## 3. Prisma uchun natijalar

- 372 jadvaldan servisda 247 model ochiq (2 ta log jadvali bloklangan). Primary key'siz jadvallar 106 ta (shundan 84 tasi `cdc.*` tizim jadvallari), ularni Prisma model qilmaydi.
- Turli schema'larda bir xil nomli jadvallar (`SchemaVersions`, `Channel`, `AccountCodeMapping`...) Prisma'da `Schema_Nom` ko'rinishida qayta nomlangan, URL'da ham shunday ishlatiladi.
- Primary key'siz muhim jadvallar (Prisma ko'rmaydi): `CdcCore.ChangedEntity`, `dbo.LoanUpdateLog`, `dbo.LegalisationInfo`,
  `CBReport.LoanPortfolioLiquidityPrincipalPayment`, `CBReport.TurnoverAndBalanceSheet`, `CBReport.ChartOfAccounts`, `PMT.Disbursement`.
- `sql_variant` ustunlar (`LoanUpdateLog.NewValue/OldValue`, `LegalisationInfo.ColumnValue`) qo'llab-quvvatlanmaydi.
- `relationMode="prisma"` tufayli bog'lanishlar (FK) modelda yo'q: ular shu hujjatdagi grafdan olinadi, ID bo'yicha ulanadi.

## 4. Real vaqt / o'zgarishlarni olish (cron)

Asosiy jadvallarda (`BaseClient`, `Loan`, `Person`) "o'zgargan vaqt" ustuni **yo'q**. Variantlar:

| Usul | Qamrov | Izoh |
|---|---|---|
| `OID` bo'yicha kursor (`after=`) | yangi yozuvlar | tayyor, oddiy; yangilanishni ko'rmaydi |
| **`CdcCore.ChangedEntity`** (`EntityId`, `EntityType`, `ChangeLsn`) | yangi + o'zgargan, kredit/mijoz/ariza | FlexFin'ning o'zi GRKI/ASOKI/DCR uchun yuritadigan o'zgarish navbati; 14 ming qator. **Eng yaxshi manba** |
| `LoanUpdateLog` (`ServerDateTime`, `Action`) | kredit maydonlari tarixi | PK yo'q, `sql_variant` |
| `OptimisticLockField` | o'zgarganligi | qiymat oshadi, lekin "qachon" yo'q: kunlik solishtirish uchun |
| `Document.Date`, `DocumentState.DateTime` | buxgalteriya hujjatlari | sana bo'yicha filtr, katta jadval |

Eslatma: `ChangedEntity` ni boshqa tizimlar (`IsUsedBy...` bayroqlari) ishlatadi. Biz uni faqat **o'qiymiz**, bayroq yozmaymiz.
O'qish uchun primary key'siz jadvalga qat'iy (qo'lda yozilgan, parametrlanmagan) `SELECT` kerak. Bu "faqat Prisma modeli" qoidasidan
bitta ongli istisno bo'ladi.

## 5. Tavsiya etilgan API (yuqori darajadagi, CRM uchun)

1. `GET /v1/<Model>` (bor): ixtiyoriy jadval, filtr, kursor. Yangi: `Field__isnull=true` (masalan `GCRecord__isnull=true` = faqat o'chirilmaganlar).
2. `GET /v1/feed/changes?after=<lsn>` (taklif): `CdcCore.ChangedEntity` dan `{EntityType, EntityId, ChangeLsn}`; 21.4 shu bo'yicha tegishli yozuvni `/v1/<Model>/<id>` dan oladi.
3. Mijoz/kredit uchun yig'ma (taklif): `/v1/clients/:oid` = `BaseClient + Person/Passport + telefonlar`; `/v1/loans/:oid` = `FinObject + Loan + LoanApplication + garovlar`.
4. Buxgalteriya (`Document`, `Operation`, `TurnoverAndBalance...`): faqat sana oralig'i bilan, `take` cheklovi bilan.

## 6. Ochiq savollar

- Qaysi ma'lumot "ma'lum servis"ga kerak (mijoz, kredit, to'lov, buxgalteriya)?
- Shaxsiy ma'lumot (pasport, JSHSHIR, telefon) CRM'ga kerakmi yoki yashirinmi?
- `ChangedEntity` feed'i (raw `SELECT` istisnosi) kerakmi?
