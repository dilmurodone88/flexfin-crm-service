import { Inject, Injectable, Logger } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CatalogService } from '../catalog/catalog.service';
import { badRequest, notFound, tooMany } from '../common/errors';
import { Env, ENV } from '../config/env';
import { PrismaService } from '../prisma/prisma.service';
import { RegistryService } from '../registry/registry.service';

export const ZERO_LSN = '0x00000000000000000000';
export const validLsn = (s: string) => /^0x[0-9A-Fa-f]{20}$/.test(s);
const GROUP_CAP = 50_000;

// FlexFin'ning o'z o'zgarish navbati (CdcCore.ChangedEntity). FAQAT o'qiladi; bayroq yozilmaydi.
const SELECT_COLS = `EntityId, EntityType, CONVERT(varchar(22), ChangeLsn, 1) AS Lsn`;
const afterSql = (take: number) =>
  `SELECT TOP (${take}) ${SELECT_COLS} FROM [CdcCore].[ChangedEntity] WHERE ChangeLsn > CONVERT(varbinary(10), @P1, 1) ORDER BY ChangeLsn ASC, EntityType ASC, EntityId ASC`;
const groupSql = `SELECT TOP (${GROUP_CAP}) ${SELECT_COLS} FROM [CdcCore].[ChangedEntity] WHERE ChangeLsn = CONVERT(varbinary(10), @P1, 1) ORDER BY EntityType ASC, EntityId ASC`;
const LATEST_SQL = `SELECT CONVERT(varchar(22), MAX(ChangeLsn), 1) AS Lsn FROM [CdcCore].[ChangedEntity]`;

export interface ChangeRow {
  EntityId: bigint | number | string;
  EntityType: string;
  Lsn: string;
}

/**
 * Bir LSN ostida (bitta tranzaksiya) ko'p qator bo'lishi mumkin. Kursor `> LSN` bo'lgani uchun
 * partiya LSN guruhining o'rtasida KESILMASLIGI shart, aks holda qolgan qatorlar yo'qoladi.
 * Shu funksiya hamma vaqt to'liq LSN guruhlarini qaytaradi.
 */
export async function pageByLsn(
  select: (sql: string, ...v: unknown[]) => Promise<ChangeRow[]>,
  after: string,
  take: number,
): Promise<ChangeRow[]> {
  const fetched = await select(afterSql(take + 1), after);
  if (fetched.length <= take) return fetched; // oxirigacha yetdik: hamma guruh to'liq
  const cutoff = fetched[take].Lsn; // keyingi (to'liq bo'lmagan) guruh
  const complete = fetched.filter((r) => r.Lsn < cutoff);
  if (complete.length) return complete;
  return select(groupSql, cutoff); // butun partiya bitta LSN: o'sha guruhni to'liq olamiz
}

@Injectable()
export class FeedService {
  private readonly logger = new Logger(FeedService.name);
  streams = 0;

  constructor(
    @Inject(ENV) private readonly env: Env,
    private readonly prisma: PrismaService,
    private readonly registry: RegistryService,
    private readonly catalog: CatalogService,
  ) {}

  private ensure() {
    if (!this.registry.feedAvailable) throw notFound('Feed mavjud emas (CdcCore.ChangedEntity topilmadi)');
  }

  private page(after: string, take: number): Promise<ChangeRow[]> {
    return this.prisma.run(() => pageByLsn((sql, ...v) => this.catalog.select<ChangeRow>(sql, ...v), after, take));
  }

  async changes(afterRaw: string | undefined, takeRaw: string | undefined) {
    this.ensure();
    const after = afterRaw ?? ZERO_LSN;
    if (!validLsn(after)) throw badRequest('after: LSN (0x + 20 hex belgi) kerak');
    const take = Math.min(Math.max(Number(takeRaw ?? 500) || 500, 1), 5000);
    const data = await this.page(after, take);
    return { count: data.length, data, nextAfter: data.length ? data[data.length - 1].Lsn : after };
  }

  async latest() {
    this.ensure();
    const r = await this.prisma.run(() => this.catalog.select<{ Lsn: string | null }>(LATEST_SQL));
    return { lsn: r[0]?.Lsn ?? ZERO_LSN };
  }

  /** Server-Sent Events: now | 0 (boshidan) | LSN (Last-Event-ID bilan davom ettirish). */
  async open(afterRaw: string | undefined): Promise<Observable<{ id: string; type: string; data: unknown }>> {
    this.ensure();
    // joyni DARHOL band qilamiz (await'lardan oldin): aks holda parallel ulanishlar chegarani aylanib o'tadi
    if (this.streams >= this.env.MAX_STREAMS) throw tooMany('Oqimlar soni chegaradan oshdi');
    this.streams++;
    let released = false;
    const release = () => {
      if (!released) {
        released = true;
        this.streams--;
      }
    };
    let after: string;
    try {
      after = afterRaw && afterRaw !== 'now' ? afterRaw : (await this.latest()).lsn;
      if (afterRaw === '0') after = ZERO_LSN;
      if (!validLsn(after)) throw badRequest('after: now | 0 | LSN (0x + 20 hex)');
    } catch (e) {
      release();
      throw e;
    }

    return new Observable((sub) => {
      let stop = false;
      void (async () => {
        let cursor = after;
        let lastWrite = Date.now();
        while (!stop) {
          let batch: ChangeRow[] = [];
          try {
            batch = await this.page(cursor, 500);
            for (const r of batch) sub.next({ id: r.Lsn, type: 'change', data: r });
            if (batch.length) {
              cursor = batch[batch.length - 1].Lsn;
              lastWrite = Date.now();
            }
          } catch (e: any) {
            this.prisma.dbErrors++;
            this.logger.error(`stream xatosi: ${e.message}`);
            sub.next({ id: cursor, type: 'error', data: { error: 'baza vaqtincha mavjud emas' } });
            lastWrite = Date.now();
          }
          if (Date.now() - lastWrite > 15000) {
            sub.next({ id: cursor, type: 'ping', data: {} });
            lastWrite = Date.now();
          }
          if (batch.length < 500) await new Promise((r) => setTimeout(r, this.env.FEED_POLL_MS));
        }
      })();
      return () => {
        stop = true;
        release();
      };
    });
  }
}
