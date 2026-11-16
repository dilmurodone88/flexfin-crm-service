import { Inject, Injectable } from '@nestjs/common';
import { CatalogService, QueryError } from '../catalog/catalog.service';
import { badRequest, notFound } from '../common/errors';
import { MaskingService } from '../common/masking.service';
import { Qs, qentries, qget } from '../common/types';
import { Env, ENV } from '../config/env';
import { PrismaService } from '../prisma/prisma.service';
import { RegistryService } from '../registry/registry.service';
import { clampTake } from './query';

@Injectable()
export class RawService {
  constructor(
    @Inject(ENV) private readonly env: Env,
    private readonly prisma: PrismaService,
    private readonly registry: RegistryService,
    private readonly catalog: CatalogService,
    private readonly masking: MaskingService,
  ) {}

  tables() {
    return { data: [...this.registry.rawTables.values()].map((t) => `${t.sch}.${t.tbl}`) };
  }

  read(name: string, query: Qs) {
    const table = this.registry.rawTables.get(name.toLowerCase());
    if (!table) throw notFound("Raw jadval topilmadi (/v1/raw ro'yxatiga qarang)");
    const take = clampTake(qget(query, 'take'), this.env.DEFAULT_TAKE, this.env.MAX_TAKE);
    const skip = Math.max(Number(qget(query, 'skip') ?? 0) || 0, 0);
    const filters = qentries(query).filter(([k]) => k !== 'take' && k !== 'skip');
    return this.prisma.run(async () => {
      let rows: any[];
      try {
        rows = await this.catalog.readRaw(table, filters, take, skip);
      } catch (e) {
        if (e instanceof QueryError) throw badRequest(e.message);
        throw e;
      }
      const shape = { name: table.tbl, pk: [] as string[], refs: new Map<string, unknown>() };
      const body: Record<string, unknown> = {
        table: `${table.sch}.${table.tbl}`,
        count: rows.length,
        data: rows.map((r) => this.masking.mask(r, shape)),
      };
      if (rows.length === take) body.nextSkip = skip + take;
      return body;
    });
  }
}
