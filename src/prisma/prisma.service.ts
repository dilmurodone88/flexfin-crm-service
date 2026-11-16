import { Inject, Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { gatewayTimeout } from '../common/errors';
import { Env, ENV } from '../config/env';
import { makeReadOnly } from './readonly.extension';

const TRANSIENT = /ECONNRESET|ETIMEDOUT|ECONNREFUSED|Connection|socket|timed out|Can't reach/i;
const TRANSIENT_CODES = new Set(['P1001', 'P1002', 'P1008', 'P1017', 'P2024', 'P2034']);

export const isTransient = (e: any): boolean =>
  !e?.getStatus && (TRANSIENT_CODES.has(e?.code) || TRANSIENT.test(String(e?.message ?? '')));

@Injectable()
export class PrismaService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name);
  /** Xom klient: FAQAT katalog/feed'dagi qat'iy SELECT'lar uchun (CatalogService). */
  readonly base: PrismaClient;
  /** Faqat-o'qish klienti: modellar bo'yicha so'rovlar uchun. */
  readonly db: any;
  dbErrors = 0;

  constructor(@Inject(ENV) private readonly env: Env) {
    this.base = new PrismaClient({ log: ['error'] });
    this.db = makeReadOnly(this.base);
  }

  async onModuleInit() {
    try {
      await this.base.$connect();
    } catch (e: any) {
      this.logger.error(`Bazaga ulanib bo'lmadi (keyin qayta uriniladi): ${e.message}`);
    }
  }

  async onModuleDestroy() {
    await this.base.$disconnect().catch(() => undefined);
  }

  private async withTimeout<T>(p: Promise<T>): Promise<T> {
    let t: NodeJS.Timeout;
    const timeout = new Promise<never>((_, rej) => {
      t = setTimeout(() => rej(gatewayTimeout('Baza javob bermadi (timeout)')), this.env.DB_TIMEOUT_MS);
    });
    try {
      return await Promise.race([p, timeout]);
    } finally {
      clearTimeout(t!);
    }
  }

  /** GET'lar idempotent: vaqtinchalik ulanish xatosida bir marta qayta urinadi. */
  async run<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await this.withTimeout(fn());
    } catch (e) {
      if (!isTransient(e)) throw e;
      this.dbErrors++;
      await new Promise((r) => setTimeout(r, 300));
      return this.withTimeout(fn());
    }
  }
}
