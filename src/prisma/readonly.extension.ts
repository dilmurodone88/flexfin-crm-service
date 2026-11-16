import type { PrismaClient } from '@prisma/client';

/**
 * Prisma klientini FAQAT-O'QISH rejimiga o'tkazadi.
 * - ruxsat: findMany / findUnique / findFirst / count
 * - taqiq: create/update/delete/upsert/*Many, $executeRaw*, $queryRaw*, $transaction
 */
export const READ_OPS = new Set(['findMany', 'findUnique', 'findFirst', 'count']);

const deny = (name: string) => () => {
  throw new Error(`${name}: faqat-o'qish rejimi, taqiqlangan`);
};

export function makeReadOnly(base: PrismaClient): any {
  return base.$extends({
    name: 'read-only',
    query: {
      $allModels: {
        $allOperations({ model, operation, args, query }: any) {
          if (!READ_OPS.has(operation)) {
            throw new Error(`${model}.${operation}: faqat-o'qish rejimi, taqiqlangan`);
          }
          return query(args);
        },
      },
    },
    client: {
      $executeRaw: deny('$executeRaw'),
      $executeRawUnsafe: deny('$executeRawUnsafe'),
      $queryRaw: deny('$queryRaw'),
      $queryRawUnsafe: deny('$queryRawUnsafe'),
      $transaction: deny('$transaction'),
    },
  } as any);
}
