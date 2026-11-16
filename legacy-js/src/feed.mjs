// FlexFin'ning o'z o'zgarish navbati: CdcCore.ChangedEntity (EntityId, EntityType, ChangeLsn).
// FAQAT o'qiladi (bayroq yozilmaydi). Primary key yo'q, shuning uchun LSN bo'yicha kursor ishlatiladi.
import { readOnlyQuery } from "./catalog.mjs";

export const ZERO_LSN = "0x00000000000000000000";
export const validLsn = (s) => /^0x[0-9A-Fa-f]{20}$/.test(s);

const CHANGES_SQL = (take) =>
  `SELECT TOP (${take}) EntityId, EntityType, CONVERT(varchar(22), ChangeLsn, 1) AS Lsn ` +
  `FROM [CdcCore].[ChangedEntity] WHERE ChangeLsn > CONVERT(varbinary(10), @P1, 1) ORDER BY ChangeLsn ASC`;

const LATEST_SQL = `SELECT CONVERT(varchar(22), MAX(ChangeLsn), 1) AS Lsn FROM [CdcCore].[ChangedEntity]`;

export async function readChanges(base, { after, take }) {
  if (!Number.isInteger(take) || take < 1 || take > 5000) throw new Error("take noto'g'ri");
  return readOnlyQuery(base, CHANGES_SQL(take), after ?? ZERO_LSN);
}

export async function latestLsn(base) {
  const rows = await readOnlyQuery(base, LATEST_SQL);
  return rows[0]?.Lsn ?? ZERO_LSN;
}
