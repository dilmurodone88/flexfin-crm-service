import { PrismaClient } from '@prisma/client';
import { makeReadOnly } from '../src/prisma/readonly.extension';

describe('faqat-o‘qish himoyasi (Prisma darajasi)', () => {
  const db = makeReadOnly(
    new PrismaClient({ datasourceUrl: 'sqlserver://127.0.0.1:1;database=x;user=a;password=b;trustServerCertificate=true;connectTimeout=1' }),
  );
  const writes: Record<string, () => Promise<unknown>> = {
    create: () => db.placeholder.create({ data: { id: 1 } }),
    createMany: () => db.placeholder.createMany({ data: [] }),
    update: () => db.placeholder.update({ where: { id: 1 }, data: {} }),
    updateMany: () => db.placeholder.updateMany({ data: {} }),
    upsert: () => db.placeholder.upsert({ where: { id: 1 }, create: { id: 1 }, update: {} }),
    delete: () => db.placeholder.delete({ where: { id: 1 } }),
    deleteMany: () => db.placeholder.deleteMany({}),
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
    const err = await db.placeholder.findMany({ take: 1 }).then(() => null, (e: Error) => e);
    expect(String(err?.message ?? '')).not.toMatch(/faqat-o'qish/);
  }, 30000);
});
