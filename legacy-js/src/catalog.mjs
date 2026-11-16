// Bazadan tuzilish (jadval/ustun/foreign key) o'qish va primary key'siz jadvallarni xavfsiz o'qish.
// Bu modul serverdagi YAGONA raw SQL joyi. Qoidalar:
//   - faqat SELECT (assertSelect tekshiradi), `;` va izohlar taqiqlangan;
//   - identifikatorlar (schema/jadval/ustun) FAQAT katalogdan (sys.*) olinadi va [..] bilan o'raladi;
//   - qiymatlar doim parametr (@P1...), SQL matniga qo'shilmaydi; take/skip tekshirilgan butun sonlar.

const CATALOG_COLUMNS = `
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

const CATALOG_FKS = `
SELECT f.constraint_object_id AS fk, ps.name AS csch, pt.name AS ctbl, cc.name AS ccol,
       rs.name AS psch, rt.name AS ptbl, pc.name AS pcol
FROM sys.foreign_key_columns f
JOIN sys.tables pt ON pt.object_id = f.parent_object_id
JOIN sys.schemas ps ON ps.schema_id = pt.schema_id
JOIN sys.columns cc ON cc.object_id = f.parent_object_id AND cc.column_id = f.parent_column_id
JOIN sys.tables rt ON rt.object_id = f.referenced_object_id
JOIN sys.schemas rs ON rs.schema_id = rt.schema_id
JOIN sys.columns pc ON pc.object_id = f.referenced_object_id AND pc.column_id = f.referenced_column_id`;

export function assertSelect(sql) {
  if (!/^\s*SELECT\b/i.test(sql) || /;|--|\/\*/.test(sql)) throw new Error("faqat-o'qish: ruxsat etilmagan SQL");
}

export const tkey = (sch, tbl) => `${sch}.${tbl}`.toLowerCase();

// Qat'iy (kod ichidagi) SELECT'lar uchun: parametrlar @P1... orqali.
export async function readOnlyQuery(base, sql, ...values) {
  assertSelect(sql);
  return base.$queryRawUnsafe(sql, ...values);
}

export async function loadCatalog(base) {
  assertSelect(CATALOG_COLUMNS);
  assertSelect(CATALOG_FKS);
  const colRows = await base.$queryRawUnsafe(CATALOG_COLUMNS);
  const fkRows = await base.$queryRawUnsafe(CATALOG_FKS);

  const tables = new Map(); // tkey -> { sch, tbl, cols: [{name, typ, pk}] }
  for (const r of colRows) {
    const k = tkey(r.sch, r.tbl);
    if (!tables.has(k)) tables.set(k, { sch: r.sch, tbl: r.tbl, cols: [] });
    tables.get(k).cols.push({ name: r.col, typ: r.typ, pk: Number(r.pk) });
  }

  // Bir nechta ustunli (composite) FK'lar bu yerda e'tiborga olinmaydi: ular noaniq bog'lanish beradi.
  const byFk = new Map();
  for (const r of fkRows) {
    const id = String(r.fk);
    if (!byFk.has(id)) byFk.set(id, []);
    byFk.get(id).push(r);
  }
  const fks = [];
  for (const rows of byFk.values()) {
    if (rows.length !== 1) continue;
    const r = rows[0];
    fks.push({ child: tkey(r.csch, r.ctbl), column: r.ccol, parent: tkey(r.psch, r.ptbl), parentName: `${r.psch}.${r.ptbl}`, parentColumn: r.pcol });
  }
  return { tables, fks };
}

// ---- primary key'siz jadvallar uchun xavfsiz o'qish ----------------------------------
const q = (name) => `[${String(name).replace(/\]/g, "]]")}]`;

function selectExpr(col) {
  const c = q(col.name);
  switch (col.typ) {
    case "sql_variant":
    case "xml":
    case "geography":
    case "geometry":
    case "hierarchyid":
      return `CAST(${c} AS nvarchar(max)) AS ${c}`;
    case "binary":
    case "varbinary":
    case "image":
    case "timestamp":
    case "rowversion":
      return `CONVERT(varchar(max), ${c}, 1) AS ${c}`;
    default:
      return c;
  }
}

function paramValue(col, raw) {
  switch (col.typ) {
    case "tinyint": case "smallint": case "int": case "bigint": {
      if (!/^-?\d+$/.test(raw)) throw Object.assign(new Error(`${col.name}: butun son kerak`), { status: 400 });
      return Number(raw);
    }
    case "decimal": case "numeric": case "money": case "smallmoney": case "float": case "real": {
      const n = Number(raw);
      if (Number.isNaN(n)) throw Object.assign(new Error(`${col.name}: son kerak`), { status: 400 });
      return n;
    }
    case "bit":
      return raw === "true" || raw === "1";
    case "date": case "datetime": case "datetime2": case "smalldatetime": {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) throw Object.assign(new Error(`${col.name}: sana noto'g'ri (ISO kerak)`), { status: 400 });
      return d;
    }
    case "varchar": case "nvarchar": case "char": case "nchar": case "uniqueidentifier":
      return raw;
    default:
      throw Object.assign(new Error(`${col.name}: turi (${col.typ}) bo'yicha filtr yo'q`), { status: 400 });
  }
}

export async function readRaw(base, table, params, { take, skip }) {
  if (!Number.isInteger(take) || !Number.isInteger(skip) || take < 1 || skip < 0) {
    throw Object.assign(new Error("take/skip noto'g'ri"), { status: 400 });
  }
  const colsByName = new Map(table.cols.map((c) => [c.name, c]));
  const where = [];
  const values = [];
  for (const [key, raw] of params) {
    if (key === "take" || key === "skip") continue;
    const col = colsByName.get(key);
    if (!col) throw Object.assign(new Error(`Noma'lum maydon: ${key}`), { status: 400 });
    values.push(paramValue(col, raw));
    where.push(`${q(col.name)} = @P${values.length}`);
  }
  const sql =
    `SELECT ${table.cols.map(selectExpr).join(", ")} FROM ${q(table.sch)}.${q(table.tbl)}` +
    (where.length ? ` WHERE ${where.join(" AND ")}` : "") +
    ` ORDER BY (SELECT NULL) OFFSET ${skip} ROWS FETCH NEXT ${take} ROWS ONLY`;
  assertSelect(sql);
  return base.$queryRawUnsafe(sql, ...values);
}
