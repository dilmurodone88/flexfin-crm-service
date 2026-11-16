import { Inject, Injectable } from '@nestjs/common';
import { badRequest, notFound } from '../common/errors';
import { MaskingService } from '../common/masking.service';
import { Qs, qentries, qget } from '../common/types';
import { Env, ENV } from '../config/env';
import { PrismaService } from '../prisma/prisma.service';
import { RegistryService } from '../registry/registry.service';
import { ModelEntry } from '../registry/registry.types';
import { buildWhere, clampTake, coerce, parseExpand } from './query';

@Injectable()
export class DataService {
  constructor(
    @Inject(ENV) private readonly env: Env,
    private readonly prisma: PrismaService,
    private readonly registry: RegistryService,
    private readonly masking: MaskingService,
  ) {}

  model(name: string): ModelEntry {
    const m = this.registry.get(name);
    if (!m) throw notFound('Model topilmadi yoki bloklangan');
    return m;
  }

  private async expandRows(rows: any[], model: ModelEntry, cols: string[]) {
    const out: Record<string, unknown>[] = rows.map(() => ({}));
    // mustaqil so'rovlar parallel: /full da 25 tagacha ketma-ket aylanma yo'ldan qutiladi
    await Promise.all(
      cols.map(async (col) => {
      const ref = model.refs.get(col)!;
      if (!ref.parent) {
        out.forEach((o) => (o[col] = null)); // ota jadval modelda yo'q (primary key'siz/bloklangan)
        return;
      }
      const vals = new Map<string, unknown>();
      for (const r of rows) if (r[col] != null) vals.set(String(r[col]), r[col]);
      const found = vals.size
        ? await this.prisma.db[ref.parent.delegate].findMany({
            where: { [ref.parentColumn]: { in: [...vals.values()] } },
            take: this.env.MAX_TAKE,
            ...this.omit(ref.parent),
          })
        : [];
      const byKey = new Map(found.map((x: any) => [String(x[ref.parentColumn]), this.masking.mask(x, ref.parent!)]));
      rows.forEach((r, i) => (out[i][col] = r[col] == null ? null : (byKey.get(String(r[col])) ?? null)));
      }),
    );
    return out;
  }

  /** Maxfiy ustunlar bazadan umuman o'qilmaydi (Prisma `omit`): ma'lumot servisga ham kelmaydi. */
  private omit(model: ModelEntry): { omit?: Record<string, true> } {
    const cols = this.masking.secretColumns(model);
    return cols.length ? { omit: Object.fromEntries(cols.map((c) => [c, true as const])) } : {};
  }

  private async present(model: ModelEntry, rows: any[], expandCols: string[]) {
    const ex = expandCols.length ? await this.expandRows(rows, model, expandCols) : null;
    return rows.map((r, i) => {
      const m = this.masking.mask(r, model);
      if (ex) m._expand = ex[i];
      return m;
    });
  }

  list(model: ModelEntry, query: Qs, extraWhere: Record<string, unknown> = {}) {
    return this.prisma.run(async () => {
      const params = qentries(query);
      const take = clampTake(qget(query, 'take'), this.env.DEFAULT_TAKE, this.env.MAX_TAKE);
      const expandCols = parseExpand(model, qget(query, 'expand'));
      const args: Record<string, any> = { take, where: { ...buildWhere(model, params), ...extraWhere } };

      const sel = qget(query, 'select');
      if (sel) {
        args.select = {};
        const secret = new Set(this.masking.secretColumns(model));
        for (const f of sel.split(',')) {
          if (!model.fields.has(f)) throw badRequest(`Noma'lum maydon: ${f}`);
          if (!secret.has(f)) args.select[f] = true; // maxfiy ustun so'ralsa ham o'qilmaydi
        }
        for (const c of [...expandCols, ...model.pk]) args.select[c] = true;
      }

      const ob = qget(query, 'orderBy');
      if (ob) {
        const [f, dir = 'asc'] = ob.split(':');
        if (!model.fields.has(f) || !['asc', 'desc'].includes(dir)) throw badRequest("orderBy noto'g'ri (maydon:asc|desc)");
        args.orderBy = { [f]: dir };
      } else if (model.pk.length > 0) {
        args.orderBy = model.pk.map((f) => ({ [f]: 'asc' }));
      }
      if (!args.select) Object.assign(args, this.omit(model));

      const after = qget(query, 'after');
      if (after != null) {
        // kursor primary key tartibiga bog'liq: boshqa orderBy bilan sahifalash qatorlarni sakratib yuborardi
        if (ob) throw badRequest("after faqat default (primary key) tartib bilan ishlaydi; orderBy ni olib tashlang yoki take/skip emas, filtr ishlating");
        if (model.pk.length !== 1) throw badRequest('after faqat bitta ustunli primary key uchun');
        args.cursor = { [model.pk[0]]: coerce(model.fields.get(model.pk[0])!, after) };
        args.skip = 1;
      }

      const rows: any[] = await this.prisma.db[model.delegate].findMany(args);
      const body: Record<string, unknown> = {
        model: model.name,
        count: rows.length,
        data: await this.present(model, rows, expandCols),
      };
      if (!ob && model.pk.length === 1 && rows.length === take) body.nextCursor = rows[rows.length - 1][model.pk[0]];
      if (qget(query, 'count') === '1') body.total = await this.prisma.db[model.delegate].count({ where: args.where });
      return body;
    });
  }

  one(model: ModelEntry, id: string, expandCols: string[]) {
    return this.prisma.run(async () => {
      if (model.pk.length !== 1) throw badRequest("Bu jadvalda bitta ustunli primary key yo'q; ro'yxat orqali filtrlang");
      const row = await this.prisma.db[model.delegate].findUnique({
        where: { [model.pk[0]]: coerce(model.fields.get(model.pk[0])!, id) },
        ...this.omit(model),
      });
      if (!row) throw notFound('Topilmadi');
      return { model: model.name, data: (await this.present(model, [row], expandCols))[0] };
    });
  }

  async children(model: ModelEntry, id: string, childName: string, query: Qs) {
    const child = this.registry.get(childName);
    const links = child ? this.registry.childLinks(model).filter((r) => r.child === child) : [];
    if (!child || !links.length) throw notFound(`${model.name} bilan ${childName} orasida bog'lanish yo'q`);
    const by = qget(query, 'by') ?? (links.length === 1 ? links[0].column : undefined);
    if (!by || !links.some((l) => l.column === by)) {
      throw badRequest(`by= kerak. Mumkin: ${links.map((l) => l.column).join(', ')}`);
    }
    return this.list(child, query, { [by]: coerce(child.fields.get(by)!, id) });
  }

  /**
   * Chuqur ko'rinish: yozuv + ota-yozuvlar zanjiri (`depth` ≤ 3, FK bo'ylab) + tanlangan bolalar (`include=A,B`, ≤ 8).
   * Misol: /v1/Loan/123/graph?depth=3&include=LoanCollateral,LoanClassification
   * Har so'rovga ≤ 150 ta baza so'rovi cheklovi bor; sikllar `seen` bilan to'xtatiladi.
   */
  async graph(model: ModelEntry, id: string, query: Qs) {
    if (model.pk.length !== 1) throw badRequest("graph: bitta ustunli primary key kerak");
    const depth = Math.min(Math.max(Number(qget(query, 'depth') ?? 2) || 0, 0), 3);
    const childTake = clampTake(qget(query, 'childTake'), 20, 200);
    const include = (qget(query, 'include') ?? '').split(',').map((s) => s.trim()).filter(Boolean);
    if (include.length > 8) throw badRequest("include: eng ko'pi bilan 8 ta");
    const budget = { left: 150 };
    return this.prisma.run(async () => {
      const row = await this.prisma.db[model.delegate].findUnique({
        where: { [model.pk[0]]: coerce(model.fields.get(model.pk[0])!, id) },
        ...this.omit(model),
      });
      if (!row) throw notFound('Topilmadi');
      const seen = new Set([`${model.name}:${id}`]);
      const data = await this.node(model, row, depth, seen, budget);
      const _children: Record<string, unknown> = {};
      const links = this.registry.childLinks(model);
      for (const name of include) {
        const child = this.registry.get(name);
        const ls = child ? links.filter((l) => l.child === child) : [];
        if (!child || !ls.length) throw badRequest(`include: '${name}' bu modelga bog'langan bola emas`);
        for (const l of ls) {
          if (budget.left-- <= 0) throw badRequest("graph: so'rovlar chegarasi (150) oshdi; depth/include ni kamaytiring");
          const found: any[] = await this.prisma.db[child.delegate].findMany({
            where: { [l.column]: coerce(child.fields.get(l.column)!, id) },
            take: childTake,
            orderBy: child.pk.map((f) => ({ [f]: 'asc' })),
            ...this.omit(child),
          });
          _children[`${child.name}.${l.column}`] = { count: found.length, more: found.length === childTake, data: found.map((r) => this.masking.mask(r, child)) };
        }
      }
      return { model: model.name, depth, data: { ...data, _children } };
    });
  }

  private async node(model: ModelEntry, row: any, depth: number, seen: Set<string>, budget: { left: number }): Promise<Record<string, unknown>> {
    const out: Record<string, unknown> = this.masking.mask(row, model);
    if (depth <= 0) return out;
    const parents: Record<string, unknown> = {};
    await Promise.all(
      [...model.refs].map(async ([col, ref]) => {
        const v = row[col];
        if (v == null || !ref.parent) return;
        const key = `${ref.parent.name}:${String(v)}`;
        if (seen.has(key)) return; // sikl yoki takror
        seen.add(key);
        if (budget.left-- <= 0) return;
        const p = await this.prisma.db[ref.parent.delegate].findFirst({ where: { [ref.parentColumn]: v }, ...this.omit(ref.parent) });
        if (p) parents[col] = await this.node(ref.parent, p, depth - 1, seen, budget);
      }),
    );
    if (Object.keys(parents).length) out._parents = parents;
    return out;
  }

  async full(model: ModelEntry, id: string) {
    const body: any = await this.one(model, id, [...model.refs.keys()].slice(0, 25));
    body.children = this.registry.childLinks(model).map((l) => ({
      model: l.child.name,
      by: l.column,
      path: `/v1/${model.name}/${id}/${l.child.name}?by=${l.column}`,
    }));
    return body;
  }
}
