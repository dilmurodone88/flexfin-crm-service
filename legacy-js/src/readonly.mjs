// Prisma klientini FAQAT-O'QISH rejimiga o'tkazadi.
// - Faqat findMany / findUnique / findFirst / count ruxsat etiladi.
// - create / update / delete / upsert / *Many / aggregate-yozish hammasi xato bilan to'xtaydi.
// - $executeRaw / $queryRaw (va Unsafe variantlari), $transaction taqiqlanadi: ular orqali SQL yozish mumkin.
export const READ_OPS = new Set(["findMany", "findUnique", "findFirst", "count"]);

const deny = (name) => () => {
  throw new Error(`${name}: faqat-o'qish rejimi, taqiqlangan`);
};

export function makeReadOnly(base) {
  return base.$extends({
    name: "read-only",
    query: {
      $allModels: {
        $allOperations({ model, operation, args, query }) {
          if (!READ_OPS.has(operation)) {
            throw new Error(`${model}.${operation}: faqat-o'qish rejimi, taqiqlangan`);
          }
          return query(args);
        },
      },
    },
    client: {
      $executeRaw: deny("$executeRaw"),
      $executeRawUnsafe: deny("$executeRawUnsafe"),
      $queryRaw: deny("$queryRaw"),
      $queryRawUnsafe: deny("$queryRawUnsafe"),
      $transaction: deny("$transaction"),
    },
  });
}
