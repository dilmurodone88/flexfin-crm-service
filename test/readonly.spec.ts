import { PrismaClient } from '@prisma/client';
import { makeReadOnly } from '../src/prisma/readonly.extension';

describe('faqat-o‘qish himoyasi (Prisma darajasi)', () => {
  const db = makeReadOnly(
    new PrismaClient({ datasourceUrl: 'sqlserver://127.0.0.1:1;database=x;user=a;password=b;trustServerCertificate=true;connectTimeout=1' }),
  );
  const writes: Record<string, () => Promise<unknown>> = {
    create: () => db.loan.create({ data: {} }),
    createMany: () => db.loan.createMany({ data: [] }),
    update: () => db.loan.update({ where: { OID: 1n }, data: {} }),
    updateMany: () => db.loan.updateMany({ data: {} }),
    upsert: () => db.loan.upsert({ where: { OID: 1n }, create: {}, update: {} }),
    delete: () => db.loan.delete({ where: { OID: 1n } }),
    deleteMany: () => db.loan.deleteMany({}),
    executeRaw: () => db.$executeRaw`DELETE FROM x`,
    executeRawUnsafe: () => db.$executeRawUnsafe('DELETE FROM x'),
    queryRaw: () => db.$queryRaw`SELECT 1`,
    queryRawUnsafe: () => db.$queryRawUnsafe('SELECT 1'),
    transaction: () => db.$transaction([]),
  };
  for (const [name, fn] of Object.entries(writes)) {
    it(`${name} bloklanadi`, async () => {
      await expect((async () => fn())()).rejects.toThrow(/faqat-o'qish/);
    });
  }
  it('findMany ruxsat (bu yerda faqat ulanish xatosi)', async () => {
    const err = await db.loan.findMany({ take: 1 }).then(() => null, (e: Error) => e);
    expect(String(err?.message ?? '')).not.toMatch(/faqat-o'qish/);
  }, 30000);
});
