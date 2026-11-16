import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { CatalogService, CatalogTable, tkey } from '../catalog/catalog.service';
import { Env, ENV } from '../config/env';
import { ModelEntry } from './registry.types';

const SKIP_RAW = /^(sd|sysdiagrams|systranschemas)$/i;

/**
 * Modellar reyestri: Prisma DMMF (modellar, maydonlar) + bazaning o'zidan bog'lanishlar (FK),
 * primary key'siz jadvallar va feed mavjudligi. Hammasi ishga tushganda bir marta o'qiladi.
 */
@Injectable()
export class RegistryService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RegistryService.name);
  readonly models = new Map<string, ModelEntry>(); // ruxsat etilgan: nom(lower) -> entry
  readonly allByTable = new Map<string, ModelEntry>(); // "schema.jadval"(lower) -> entry (bloklanganlar ham)
  readonly rawTables = new Map<string, CatalogTable>();
  relationCount = 0;
  feedAvailable = false;
  catalogLoaded = false;
  private retryTimer?: NodeJS.Timeout;
  private retryMs = 2000;

  constructor(
    @Inject(ENV) private readonly env: Env,
    private readonly catalog: CatalogService,
  ) {}

  async onModuleInit() {
    this.buildModels();
    await this.loadCatalog();
  }

  onModuleDestroy() {
    clearTimeout(this.retryTimer);
  }

  /** Katalog o'qilmasa (masalan baza hali ko'tarilmagan) 2s..60s oraliqda muvaffaqiyatli bo'lguncha qayta uriniladi. */
  /** Faqat testlar uchun. */
  loadCatalogForTest() {
    return this.loadCatalog();
  }

  private async loadCatalog(): Promise<void> {
    try {
      this.applyCatalog(await this.catalog.load());
      this.logger.log(
        `Modellar: ${this.models.size}, bog'lanishlar: ${this.relationCount}, raw jadvallar: ${this.rawTables.size}, feed: ${this.feedAvailable}`,
      );
    } catch (e: any) {
      this.catalogLoaded = false;
      this.logger.error(`Katalog o'qilmadi (${e.message}); ${Math.round(this.retryMs / 1000)}s dan keyin qayta uriniladi`);
      this.retryTimer = setTimeout(() => void this.loadCatalog(), this.retryMs);
      this.retryTimer.unref?.();
      this.retryMs = Math.min(this.retryMs * 2, 60_000);
    }
  }

  buildModels(dmmfModels: any[] = Prisma.dmmf.datamodel.models as any[]) {
    for (const m of dmmfModels) {
      const fields = new Map(
        m.fields
          .filter((f: any) => f.kind === 'scalar' || f.kind === 'enum')
          .map((f: any) => [f.name, { name: f.name, type: f.type, kind: f.kind, isRequired: !!f.isRequired, isId: !!f.isId }]),
      );
      const pk: string[] = m.primaryKey?.fields ?? m.fields.filter((f: any) => f.isId).map((f: any) => f.name);
      const entry: ModelEntry = {
        name: m.name,
        delegate: m.name[0].toLowerCase() + m.name.slice(1),
        table: tkey(m.schema ?? 'dbo', m.dbName ?? m.name),
        blocked: this.env.BLOCK_MODELS.includes(m.name.toLowerCase()),
        fields: fields as ModelEntry['fields'],
        pk,
        refs: new Map(),
        referencedBy: [],
      };
      this.allByTable.set(entry.table, entry);
      if (!entry.blocked) this.models.set(m.name.toLowerCase(), entry);
    }
  }

  applyCatalog(catalog: { tables: Map<string, CatalogTable>; fks: any[] }) {
    // idempotent: qayta chaqirilganda hisoblar ikki marta qo'shilmasin
    for (const m of this.allByTable.values()) {
      m.refs.clear();
      m.referencedBy.length = 0;
    }
    this.rawTables.clear();
    this.relationCount = 0;
    for (const fk of catalog.fks) {
      const child = this.allByTable.get(fk.child);
      if (!child || child.blocked || !child.fields.has(fk.column)) continue;
      const parent = this.allByTable.get(fk.parent);
      const p = parent && !parent.blocked && parent.fields.has(fk.parentColumn) ? parent : null;
      child.refs.set(fk.column, { parent: p, parentName: fk.parentName, parentColumn: fk.parentColumn });
      if (p) p.referencedBy.push({ child, column: fk.column, parentColumn: fk.parentColumn });
      this.relationCount++;
    }
    for (const [k, t] of catalog.tables) {
      if (this.allByTable.has(k) || t.sch.toLowerCase() === 'cdc' || SKIP_RAW.test(t.tbl)) continue;
      if (this.env.BLOCK_MODELS.includes(t.tbl.toLowerCase()) || this.env.BLOCK_MODELS.includes(k)) continue;
      this.rawTables.set(k, t);
    }
    this.feedAvailable = catalog.tables.has('cdccore.changedentity');
    this.catalogLoaded = true;
  }

  get(name: string): ModelEntry | undefined {
    return this.models.get(String(name).toLowerCase());
  }

  childLinks(model: ModelEntry) {
    return model.referencedBy.filter((r) => model.pk.length === 1 && r.parentColumn === model.pk[0]);
  }
}
