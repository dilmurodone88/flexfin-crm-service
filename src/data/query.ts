import { Prisma } from '@prisma/client';
import { badRequest } from '../common/errors';
import { FieldInfo, ModelEntry } from '../registry/registry.types';

export const RESERVED = new Set(['take', 'after', 'orderBy', 'select', 'count', 'expand', 'skip', 'by', 'depth', 'include', 'childTake']);
const OPS = new Set(['gt', 'gte', 'lt', 'lte', 'contains', 'startsWith', 'not', 'in', 'isnull']);

export function coerce(field: FieldInfo, raw: string): unknown {
  switch (field.type) {
    case 'Int': {
      const n = Number(raw);
      if (!Number.isInteger(n)) throw badRequest(`${field.name}: butun son kerak`);
      return n;
    }
    case 'BigInt':
      try {
        return BigInt(raw);
      } catch {
        throw badRequest(`${field.name}: butun son kerak`);
      }
    case 'Float': {
      const n = Number(raw);
      if (Number.isNaN(n)) throw badRequest(`${field.name}: son kerak`);
      return n;
    }
    case 'Decimal':
      try {
        return new Prisma.Decimal(raw);
      } catch {
        throw badRequest(`${field.name}: son kerak`);
      }
    case 'Boolean':
      return raw === 'true' || raw === '1';
    case 'DateTime': {
      const d = new Date(raw);
      if (Number.isNaN(d.getTime())) throw badRequest(`${field.name}: sana noto'g'ri (ISO kerak)`);
      return d;
    }
    case 'String':
      return raw;
    default:
      throw badRequest(`${field.name}: turi (${field.type}) bo'yicha filtr yo'q`);
  }
}

/** ?Field=v, ?Field__gte=, __gt/__lt/__lte/__contains/__startsWith/__not/__in=a,b/__isnull=true */
export function buildWhere(model: ModelEntry, params: [string, string][]): Record<string, any> {
  const where: Record<string, any> = {};
  for (const [key, val] of params) {
    if (RESERVED.has(key)) continue;
    const [name, op = 'equals'] = key.split('__');
    const field = model.fields.get(name);
    if (!field) throw badRequest(`Noma'lum maydon: ${name}`);
    if (op !== 'equals' && !OPS.has(op)) throw badRequest(`Noma'lum operator: ${op}`);
    if ((op === 'contains' || op === 'startsWith') && field.type !== 'String') {
      throw badRequest(`${name}: ${op} faqat String uchun`);
    }
    if (op === 'isnull') {
      // ?GCRecord__isnull=true -> o'chirilmagan yozuvlar (XPO soft-delete); false -> o'chirilganlar
      Object.assign((where[name] ??= {}), val === 'true' || val === '1' ? { equals: null } : { not: null });
      continue;
    }
    const value = op === 'in' ? val.split(',').map((v) => coerce(field, v)) : coerce(field, val);
    where[name] = { ...(where[name] ?? {}), [op]: value };
  }
  return where;
}

export function parseExpand(model: ModelEntry, raw: string | undefined): string[] {
  if (!raw) return [];
  const all = [...model.refs.keys()];
  const cols = raw === '*' ? all.slice(0, 25) : raw.split(',').map((c) => c.trim()).filter(Boolean);
  if (cols.length > 25) throw badRequest("expand: eng ko'pi bilan 25 ta");
  for (const c of cols) {
    if (!model.refs.has(c)) throw badRequest(`expand: '${c}' bog'lanish emas. Mumkin: ${all.join(', ') || "yo'q"}`);
  }
  return cols;
}

export function clampTake(raw: string | undefined, def: number, max: number): number {
  return Math.min(Math.max(Number(raw ?? def) || def, 1), max);
}
