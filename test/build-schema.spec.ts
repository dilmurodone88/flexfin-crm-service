// eslint-disable-next-line @typescript-eslint/no-var-requires
const { buildSchema } = require('../scripts/build-schema.cjs');

const INTROSPECTED = `datasource db {
  provider     = "sqlserver"
  url          = env("DATABASE_URL")
}

model Parent {
  OID BigInt @id
  @@schema("dbo")
}

model Child {
  OID BigInt @id
  Parent BigInt?
  Other BigInt
  @@schema("dbo")
}
`;

describe('schema yig‘uvchi', () => {
  it('bitta ustunli FK uchun ikki tomonlama relation va indeks qo‘shadi', () => {
    const dump = '##FKS\ndbo.Child|Parent|dbo.Parent|OID\ndbo.Child|Other|dbo.Nowhere|OID\n';
    const { text, report } = buildSchema(INTROSPECTED, dump);
    expect(report.added).toBe(1);
    expect(report.skipped.noModel).toBe(1);
    expect(text).toMatch(/ParentRel Parent\? @relation\("Child_Parent", fields: \[Parent\], references: \[OID\]/);
    expect(text).toMatch(/ChildViaParent Child\[\] @relation\("Child_Parent"\)/);
    expect(text).toMatch(/@@index\(\[Parent\]\)/);
    expect(text).toMatch(/relationMode = "prisma"/);
  });
  it('noaniq (composite) FK o‘tkazib yuboriladi', () => {
    const dump = '##FKS\ndbo.Child|Parent|dbo.Parent|OID\ndbo.Child|Parent|dbo.Parent|OID\n';
    const { report } = buildSchema(INTROSPECTED, dump);
    expect(report.added).toBe(0);
    expect(report.skipped.ambiguous).toBe(2);
  });
});
