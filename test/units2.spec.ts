import { clientIp } from '../src/common/client-ip';
import { orderBy } from '../src/catalog/catalog.service';
import { RegistryService } from '../src/registry/registry.service';
import { DMMF } from './fakes';

describe('clientIp', () => {
  it('faqat ishonchli proksidan XFF olinadi', () => {
    expect(clientIp('::ffff:172.28.0.10', '10.1.1.1, 172.28.0.10', ['172.28.0.10'])).toBe('10.1.1.1');
    expect(clientIp('9.9.9.9', '10.1.1.1', ['172.28.0.10'])).toBe('9.9.9.9'); // soxta XFF e'tiborsiz
    expect(clientIp('127.0.0.1', undefined, [])).toBe('127.0.0.1');
  });
});

describe('raw tartib', () => {
  const t = (cols: [string, string][]) => ({ sch: 'dbo', tbl: 'T', cols: cols.map(([name, typ]) => ({ name, typ, pk: 0 })) });
  it('tartiblanadigan ustunlar, binary/xml o‘tkazib yuboriladi', () => {
    expect(orderBy(t([['A', 'bigint'], ['Blob', 'varbinary'], ['B', 'nvarchar'], ['X', 'xml']]))).toBe('[A], [B]');
    expect(orderBy(t([['Blob', 'image']]))).toBe('(SELECT NULL)');
  });
});

describe('registry: katalog qayta urinish', () => {
  it('birinchi urinish xato bersa keyin yuklanadi, hisoblar ikki marta qo‘shilmaydi', async () => {
    jest.useFakeTimers();
    let calls = 0;
    const cat: any = {
      load: async () => {
        if (++calls === 1) throw new Error('baza yo‘q');
        return { tables: new Map(), fks: [{ child: 'dbo.person', column: 'Passport', parent: 'dbo.passport', parentName: 'dbo.Passport', parentColumn: 'OID' }] };
      },
    };
    const r = new RegistryService({ BLOCK_MODELS: [] } as any, cat);
    r.buildModels(DMMF as any);
    await r.loadCatalogForTest();
    expect(r.catalogLoaded).toBe(false);
    await jest.advanceTimersByTimeAsync(2100);
    expect(r.catalogLoaded).toBe(true);
    expect(r.relationCount).toBe(1);
    r.applyCatalog({ tables: new Map(), fks: [{ child: 'dbo.person', column: 'Passport', parent: 'dbo.passport', parentName: 'dbo.Passport', parentColumn: 'OID' }] });
    expect(r.relationCount).toBe(1); // idempotent
    r.onModuleDestroy();
    jest.useRealTimers();
  });
});
