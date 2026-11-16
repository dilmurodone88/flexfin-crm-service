// Soxta baza: xotiradagi ma'lumot + katalog javoblari. Haqiqiy servis mantig'ini sinash uchun.
const f = (name: string, type: string, isId = false) => ({ name, kind: 'scalar', type, isId, isRequired: isId });
const model = (name: string, fields: any[], schema = 'dbo') => ({ name, dbName: null, schema, fields, primaryKey: null });

export const DMMF = [
  model('BaseClient', [f('OID', 'BigInt', true), f('Name', 'String'), f('TaxCode', 'String'), f('GCRecord', 'Int')]),
  model('Passport', [f('OID', 'BigInt', true), f('Series', 'String'), f('Number', 'String')]),
  model('Person', [f('OID', 'BigInt', true), f('Name', 'String'), f('Passport', 'BigInt'), f('BirthDate', 'DateTime')]),
  model('FinObject', [f('OID', 'BigInt', true), f('Client', 'BigInt'), f('Amount', 'Decimal')]),
  model('Loan', [f('OID', 'BigInt', true), f('Application', 'BigInt')]),
  model('isUser', [f('OID', 'BigInt', true), f('UserName', 'String'), f('Password', 'String'), f('PasswordSalt', 'String'), f('SID', 'String')]),
  model('SystemLog', [f('RecordID', 'BigInt', true)]),
];

export const DATA: Record<string, any[]> = {
  baseClient: [
    { OID: 1n, Name: 'Ali', TaxCode: '123456789', GCRecord: null },
    { OID: 2n, Name: 'Vali', TaxCode: '987654321', GCRecord: 5 },
  ],
  passport: [{ OID: 10n, Series: 'AA', Number: '1234567' }],
  person: [{ OID: 1n, Name: 'Ali', Passport: 10n, BirthDate: new Date('1990-01-01') }],
  finObject: [
    { OID: 100n, Client: 1n, Amount: 5000 },
    { OID: 101n, Client: 1n, Amount: 7000 },
    { OID: 102n, Client: 2n, Amount: 1 },
  ],
  loan: [
    { OID: 100n, Application: null },
    { OID: 101n, Application: null },
  ],
  isUser: [{ OID: 1n, UserName: 'admin', Password: 'hash123', PasswordSalt: 'salt', SID: 'S-1' }],
  systemLog: [{ RecordID: 1n }],
};

function match(row: any, where: any = {}): boolean {
  return Object.entries(where).every(([k, c]: [string, any]) => {
    const v = row[k];
    if (c && typeof c === 'object' && !(c instanceof Date)) {
      if ('in' in c) return c.in.map(String).includes(String(v));
      if ('equals' in c) return c.equals === null ? v == null : String(v) === String(c.equals);
      if ('not' in c) return c.not === null ? v != null : String(v) !== String(c.not);
      if ('gte' in c) return v >= c.gte;
    }
    return String(v) === String(c);
  });
}

const catalogCols = (sch: string, tbl: string, list: [string, string, number?][]) =>
  list.map(([col, typ, pk]) => ({ sch, tbl, col, typ, nl: 1, pk: pk ?? 0 }));

export const CATALOG_ROWS = [
  ...catalogCols('dbo', 'BaseClient', [['OID', 'bigint', 1], ['Name', 'nvarchar'], ['TaxCode', 'nvarchar'], ['GCRecord', 'int']]),
  ...catalogCols('dbo', 'Passport', [['OID', 'bigint', 1], ['Series', 'nvarchar'], ['Number', 'nvarchar']]),
  ...catalogCols('dbo', 'Person', [['OID', 'bigint', 1], ['Name', 'nvarchar'], ['Passport', 'bigint'], ['BirthDate', 'smalldatetime']]),
  ...catalogCols('dbo', 'FinObject', [['OID', 'bigint', 1], ['Client', 'bigint'], ['Amount', 'decimal']]),
  ...catalogCols('dbo', 'Loan', [['OID', 'bigint', 1], ['Application', 'bigint']]),
  ...catalogCols('dbo', 'LoanUpdateLog', [['Loan', 'bigint'], ['TableName', 'varchar'], ['NewValue', 'sql_variant'], ['Blob', 'varbinary'], ['PassportNo', 'nvarchar']]),
  ...catalogCols('CdcCore', 'ChangedEntity', [['EntityId', 'bigint'], ['EntityType', 'nvarchar'], ['ChangeLsn', 'varbinary']]),
  ...catalogCols('cdc', 'dbo_X_CT', [['a', 'int']]),
];

export const FK_ROWS = [
  { fk: 1, csch: 'dbo', ctbl: 'Person', ccol: 'Passport', psch: 'dbo', ptbl: 'Passport', pcol: 'OID' },
  { fk: 2, csch: 'dbo', ctbl: 'FinObject', ccol: 'Client', psch: 'dbo', ptbl: 'BaseClient', pcol: 'OID' },
  { fk: 3, csch: 'dbo', ctbl: 'Loan', ccol: 'OID', psch: 'dbo', ptbl: 'FinObject', pcol: 'OID' },
  { fk: 4, csch: 'dbo', ctbl: 'Loan', ccol: 'Application', psch: 'dbo', ptbl: 'LoanApplication', pcol: 'OID' },
  { fk: 5, csch: 'dbo', ctbl: 'X', ccol: 'a', psch: 'dbo', ptbl: 'Y', pcol: 'a' },
  { fk: 5, csch: 'dbo', ctbl: 'X', ccol: 'b', psch: 'dbo', ptbl: 'Y', pcol: 'b' },
];

export const findLog: unknown[] = [];
export const sqlLog: { sql: string; vals: unknown[] }[] = [];
export const changeFeed = [
  { EntityId: 100n, EntityType: 'Loan', Lsn: '0x00000000000000000001' },
  { EntityId: 1n, EntityType: 'BaseClient', Lsn: '0x00000000000000000002' },
];
// feed testlari uchun almashtiriladigan manba (bir LSN ostida ko'p qator)
export const feedSource: { rows: { EntityId: bigint; EntityType: string; Lsn: string }[] } = { rows: changeFeed };

export function fakePrisma() {
  const db: any = {};
  for (const m of DMMF) {
    const key = m.name[0].toLowerCase() + m.name.slice(1);
    db[key] = {
      findMany: async (a: any = {}) => {
        let rows = (DATA[key] ?? []).filter((r) => match(r, a.where));
        if (a.cursor) {
          const [k, v] = Object.entries(a.cursor)[0];
          rows = rows.slice(rows.findIndex((r) => String(r[k]) === String(v)) + 1);
        }
        rows = rows.slice(0, a.take ?? 1000);
        if (a.select) rows = rows.map((r) => Object.fromEntries(Object.keys(a.select).map((k) => [k, r[k]])));
        if (a.omit) rows = rows.map((r) => Object.fromEntries(Object.entries(r).filter(([k]) => !a.omit[k])));
        (findLog as any[]).push({ model: key, args: a });
        return rows;
      },
      findFirst: async (a: any) => {
        const r = (DATA[key] ?? []).find((x) => match(x, a.where));
        return r && a.omit ? Object.fromEntries(Object.entries(r).filter(([k]) => !a.omit[k])) : (r ?? null);
      },
      findUnique: async (a: any) => {
        const r = (DATA[key] ?? []).find((x) => match(x, a.where));
        return r && a.omit ? Object.fromEntries(Object.entries(r).filter(([k]) => !a.omit[k])) : (r ?? null);
      },
      count: async (a: any = {}) => (DATA[key] ?? []).filter((r) => match(r, a.where)).length,
    };
  }
  const base = {
    $queryRawUnsafe: async (sql: string, ...vals: unknown[]) => {
      sqlLog.push({ sql, vals });
      if (/FROM sys\.tables t\s+JOIN sys\.schemas s/.test(sql)) return CATALOG_ROWS;
      if (/sys\.foreign_key_columns/.test(sql)) return FK_ROWS;
      if (/FROM \[dbo\]\.\[LoanUpdateLog\]/.test(sql)) { sqlLog.push({ sql: '[RAW] ' + sql, vals }); return [{ Loan: 100n, TableName: 'Loan', NewValue: '5', Blob: '0xAB', PassportNo: 'AB123' }]; }
      if (/MAX\(ChangeLsn\)/.test(sql)) return [{ Lsn: changeFeed[1].Lsn }];
      if (/FROM \[CdcCore\]\.\[ChangedEntity\]/.test(sql)) {
        const top = Number(/TOP \((\d+)\)/.exec(sql)![1]);
        const eq = /ChangeLsn = CONVERT/.test(sql);
        const rows = feedSource.rows
          .filter((r) => (eq ? r.Lsn === String(vals[0]) : r.Lsn > String(vals[0])))
          .sort((a, b) => (a.Lsn === b.Lsn ? 0 : a.Lsn < b.Lsn ? -1 : 1));
        return rows.slice(0, top);
      }
      if (/^\s*SELECT 1 AS ok/.test(sql)) return [{ ok: 1 }];
      throw new Error('kutilmagan SQL: ' + sql.slice(0, 80));
    },
  };
  return { base, db, dbErrors: 0, run: <T>(fn: () => Promise<T>) => fn() };
}
