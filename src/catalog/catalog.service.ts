import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

/**
 * Serverdagi YAGONA raw SQL joyi (feed.service.ts bilan birga). Qoidalar:
 *  - faqat SELECT (assertSelect), `;` va izohlar taqiqlangan;
 *  - identifikatorlar (schema/jadval/ustun) FAQAT katalogdan (sys.*) olinadi va [..] bilan o'raladi;
 *  - qiymatlar doim parametr (@P1...); take/skip tekshirilgan butun sonlar.
 */
const COLUMNS_SQL = `
SELECT s.name AS sch, t.name AS tbl, c.name AS col, ty.name AS typ, c.is_nullable AS nl, ISNULL(pk.key_ordinal, 0) AS pk
FROM sys.tables t
JOIN sys.schemas s ON s.schema_id = t.schema_id
JOIN sys.columns c ON c.object_id = t.object_id
JOIN sys.types ty ON ty.user_type_id = c.user_type_id
LEFT JOIN (
  SELECT ic.object_id, ic.column_id, ic.key_ordinal
  FROM sys.index_columns ic
  JOIN sys.indexes i ON i.object_id = ic.object_id AND i.index_id = ic.index_id AND i.is_primary_key = 1
) pk ON pk.object_id = t.object_id AND pk.column_id = c.column_id
ORDER BY s.name, t.name, c.column_id`;

const FKS_SQL = `
SELECT f.constraint_object_id AS fk, ps.name AS csch, pt.name AS ctbl, cc.name AS ccol,
       rs.name AS psch, rt.name AS ptbl, pc.name AS pcol
FROM sys.foreign_key_columns f
JOIN sys.tables pt ON pt.object_id = f.parent_object_id
JOIN sys.schemas ps ON ps.schema_id = pt.schema_id
JOIN sys.columns cc ON cc.object_id = f.parent_object_id AND cc.column_id = f.parent_column_id
JOIN sys.tables rt ON rt.object_id = f.referenced_object_id
JOIN sys.schemas rs ON rs.schema_id = rt.schema_id
JOIN sys.columns pc ON pc.object_id = f.referenced_object_id AND pc.column_id = f.referenced_column_id`;

export interface CatalogColumn {
  name: string;
  typ: string;
  pk: number;
}
export interface CatalogTable {
  sch: string;
  tbl: string;
  cols: CatalogColumn[];
}
export interface CatalogFk {
  child: string;
  column: string;
  parent: string;
  parentName: string;
  parentColumn: string;
}
export interface Catalog {
  tables: Map<string, CatalogTable>;
  fks: CatalogFk[];
}

export const tkey = (sch: string, tbl: string) => `${sch}.${tbl}`.toLowerCase();

export function assertSelect(sql: string): void {
  if (!/^\s*SELECT\b/i.test(sql) || /;|--|\/\*/.test(sql)) {
    throw new Error("faqat-o'qish: ruxsat etilmagan SQL");
  }
}

const q = (name: string) => `[${String(name).replace(/\]/g, ']]')}]`;

function selectExpr(col: CatalogColumn): string {
  const c = q(col.name);
  switch (col.typ) {
    case 'sql_variant':
    case 'xml':
    case 'geography':
    case 'geometry':
    case 'hierarchyid':
      return `CAST(${c} AS nvarchar(max)) AS ${c}`;
    case 'binary':
    case 'varbinary':
    case 'image':
    case 'timestamp':
    case 'rowversion':
      // MB hajmli binary'ni hex qilib ko'chirmaymiz: faqat hajmi
      return `CASE WHEN ${c} IS NULL THEN NULL ELSE '[binary ' + CAST(DATALENGTH(${c}) AS varchar(20)) + ' bayt]' END AS ${c}`;
    default:
      return c;
  }
}

const UNSORTABLE = new Set(['text', 'ntext', 'image', 'xml', 'sql_variant', 'geography', 'geometry', 'hierarchyid', 'binary', 'varbinary', 'timestamp', 'rowversion']);

/** Sahifalash barqaror bo'lishi uchun aniq tartib: tartiblanadigan birinchi 8 ustun (PK yo'qligi uchun). */
export function orderBy(table: CatalogTable): string {
  const cols = table.cols.filter((c) => !UNSORTABLE.has(c.typ)).slice(0, 8);
  return cols.length ? cols.map((c) => q(c.name)).join(', ') : '(SELECT NULL)';
}

export class QueryError extends Error {
  constructor(
    message: string,
    readonly status = 400,
  ) {
    super(message);
  }
}

function paramValue(col: CatalogColumn, raw: string): unknown {
  switch (col.typ) {
    case 'tinyint':
    case 'smallint':
    case 'int':
    case 'bigint':
      if (!/^-?\d+$/.test(raw)) throw new QueryError(`${col.name}: butun son kerak`);
      return Number(raw);
    case 'decimal':
    case 'numeric':
    case 'money':
    case 'smallmoney':
    case 'float':
    case 'real': {
      const n = Number(raw);
      if (Number.isNaN(n)) throw new QueryError(`${col.name}: son kerak`);
      return n;
    }
    case 'bit':
      return raw === 'true' || raw === '1';
    case 'date':
    case 'datetime':
    case 'datetime2':
    case 'smalldatetime': {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) throw new QueryError(`${col.name}: sana noto'g'ri (ISO kerak)`);
      return d;
    }
    case 'varchar':
    case 'nvarchar':
    case 'char':
    case 'nchar':
    case 'uniqueidentifier':
      return raw;
    default:
      throw new QueryError(`${col.name}: turi (${col.typ}) bo'yicha filtr yo'q`);
  }
}

@Injectable()
export class CatalogService {
  constructor(private readonly prisma: PrismaService) {}

  /** Qat'iy (kod ichidagi) SELECT'lar uchun; parametrlar @P1... orqali. */
  async select<T = any>(sql: string, ...values: unknown[]): Promise<T[]> {
    assertSelect(sql);
    return this.prisma.base.$queryRawUnsafe<T[]>(sql, ...values);
  }

  async load(): Promise<Catalog> {
    const colRows = await this.select<any>(COLUMNS_SQL);
    const fkRows = await this.select<any>(FKS_SQL);

    const tables = new Map<string, CatalogTable>();
    for (const r of colRows) {
      const k = tkey(r.sch, r.tbl);
      if (!tables.has(k)) tables.set(k, { sch: r.sch, tbl: r.tbl, cols: [] });
      tables.get(k)!.cols.push({ name: r.col, typ: r.typ, pk: Number(r.pk) });
    }

    // Bir nechta ustunli (composite) FK'lar noaniq bog'lanish beradi, shuning uchun o'tkazib yuboriladi.
    const byFk = new Map<string, any[]>();
    for (const r of fkRows) {
      const id = String(r.fk);
      if (!byFk.has(id)) byFk.set(id, []);
      byFk.get(id)!.push(r);
    }
    const fks: CatalogFk[] = [];
    for (const rows of byFk.values()) {
      if (rows.length !== 1) continue;
      const r = rows[0];
      fks.push({
        child: tkey(r.csch, r.ctbl),
        column: r.ccol,
        parent: tkey(r.psch, r.ptbl),
        parentName: `${r.psch}.${r.ptbl}`,
        parentColumn: r.pcol,
      });
    }
    return { tables, fks };
  }

  /** Primary key'siz jadvalni xavfsiz o'qish. */
  async readRaw(table: CatalogTable, params: [string, string][], take: number, skip: number): Promise<any[]> {
    if (!Number.isInteger(take) || !Number.isInteger(skip) || take < 1 || skip < 0) {
      throw new QueryError("take/skip noto'g'ri");
    }
    const byName = new Map(table.cols.map((c) => [c.name, c]));
    const where: string[] = [];
    const values: unknown[] = [];
    for (const [key, raw] of params) {
      const col = byName.get(key);
      if (!col) throw new QueryError(`Noma'lum maydon: ${key}`);
      values.push(paramValue(col, raw));
      where.push(`${q(col.name)} = @P${values.length}`);
    }
    const sql =
      `SELECT ${table.cols.map(selectExpr).join(', ')} FROM ${q(table.sch)}.${q(table.tbl)}` +
      (where.length ? ` WHERE ${where.join(' AND ')}` : '') +
      ` ORDER BY ${orderBy(table)} OFFSET ${skip} ROWS FETCH NEXT ${take} ROWS ONLY`;
    return this.select(sql, ...values);
  }
}
