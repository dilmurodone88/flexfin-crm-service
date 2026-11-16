process.env.NODE_ENV = 'test';
process.env.API_KEY = 'testkey_0123456789_abcdefghij_xyz';
process.env.ALLOWED_IPS = '127.0.0.1';
process.env.DATABASE_URL = 'sqlserver://localhost:1433;database=x;user=a;password=b;trustServerCertificate=true';
process.env.LOG_LEVEL = 'silent';
process.env.MAX_STREAMS = '1';
process.env.FEED_POLL_MS = '200';

import 'reflect-metadata';
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};
import { Test } from '@nestjs/testing';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from '../src/app.module';
import { applyHooks } from '../src/hooks';
import { ENV } from '../src/config/env';
import { CatalogService } from '../src/catalog/catalog.service';
import { requestId } from '../src/common/request-id';
import { loadEnv } from '../src/config/env';
import { addModelDocs } from '../src/meta/openapi';
import { PrismaService } from '../src/prisma/prisma.service';
import { RegistryService } from '../src/registry/registry.service';
import { DMMF, fakePrisma, feedSource, findLog, sqlLog } from './fakes';

const H = { 'x-api-key': process.env.API_KEY! };
let app: NestFastifyApplication;
let registry: RegistryService;

beforeAll(async () => {
  const fake = fakePrisma();
  const mod = await Test.createTestingModule({ imports: [AppModule] })
    .overrideProvider(PrismaService)
    .useValue(fake)
    .overrideProvider(RegistryService)
    .useFactory({
      inject: [ENV, CatalogService],
      factory: (env: any, cat: CatalogService) => {
        const r = new RegistryService(env, cat);
        // haqiqiy ishga tushish tartibi: DMMF -> katalog (bazadan)
        r.onModuleInit = async () => {
          r.buildModels(DMMF as any);
          r.applyCatalog(await cat.load());
        };
        return r;
      },
    })
    .compile();
  registry = mod.get(RegistryService);
  app = mod.createNestApplication<NestFastifyApplication>(new FastifyAdapter({ genReqId: (r: any) => requestId(r) }));
  applyHooks(app);
  await app.init();
  await app.getHttpAdapter().getInstance().ready();
});
afterAll(async () => app?.close());

const get = (url: string, headers: Record<string, string> = H) => app.inject({ method: 'GET', url, headers });
const json = (r: any) => JSON.parse(r.body);

describe('xavfsizlik', () => {
  it('/health kalitsiz ochiq', async () => {
    const r = await get('/health', {});
    expect(r.statusCode).toBe(200);
    expect(json(r)).toMatchObject({ ok: true, service: 'flexfin-crm-service', models: 6, relations: 4, rawTables: 2, feed: true });
  });
  it('kalitsiz 401, noto‘g‘ri kalit 401', async () => {
    expect((await get('/v1/models', {})).statusCode).toBe(401);
    expect((await get('/v1/models', { 'x-api-key': 'x'.repeat(33) })).statusCode).toBe(401);
  });
  it('POST/PUT/DELETE taqiqlangan', async () => {
    for (const method of ['POST', 'PUT', 'PATCH', 'DELETE'] as const) {
      const r = await app.inject({ method, url: '/v1/Loan/100', headers: H });
      expect([404, 405]).toContain(r.statusCode);
    }
  });
  it('parol/hash bazadan umuman o‘qilmaydi (omit) va javobda yo‘q', async () => {
    findLog.length = 0;
    const b = json(await get('/v1/isUser'));
    expect(b.data[0]).toEqual({ OID: '1', UserName: 'admin' });
    expect((findLog.find((f: any) => f.model === 'isUser') as any).args.omit).toEqual({ Password: true, PasswordSalt: true, SID: true });
    expect(json(await get('/v1/isUser?select=UserName,Password')).data[0]).toEqual({ OID: '1', UserName: 'admin' });
    expect(json(await get('/v1/isUser/1')).data).toEqual({ OID: '1', UserName: 'admin' });
  });
  it('pasport/INN/tug‘ilgan sana yashirin, FK id yashirilmaydi', async () => {
    expect(json(await get('/v1/Passport')).data[0]).toMatchObject({ Series: '***', Number: '***' });
    expect(json(await get('/v1/BaseClient')).data[0].TaxCode).toBe('***');
    const p = json(await get('/v1/Person')).data[0];
    expect(p.BirthDate).toBe('***');
    expect(p.Passport).toBe('10'); // FK id
  });
  it('bloklangan model 404', async () => {
    expect((await get('/v1/SystemLog')).statusCode).toBe(404);
  });
  it('x-request-id qaytariladi', async () => {
    const r = await get('/health', { 'x-request-id': 'abc-123' });
    expect(r.headers['x-request-id']).toBe('abc-123');
  });
});

describe('bog‘lanishlar', () => {
  it('/v1/models references/referencedBy', async () => {
    const d = json(await get('/v1/models')).data;
    const person = d.find((m: any) => m.model === 'Person');
    expect(person.references).toEqual({ Passport: 'Passport.OID' });
    const fo = d.find((m: any) => m.model === 'FinObject');
    expect(fo.references).toEqual({ Client: 'BaseClient.OID' });
    expect(fo.referencedBy).toEqual([{ model: 'Loan', by: 'OID' }]);
    expect(d.find((m: any) => m.model === 'Loan').references.Application).toMatch(/modelsiz/);
  });
  it('expand ota yozuvni qo‘shadi (maska bilan)', async () => {
    const b = json(await get('/v1/Person?expand=Passport'));
    expect(b.data[0]._expand.Passport).toMatchObject({ OID: '10', Series: '***' });
  });
  it('/full: meros zanjiri va bolalarga havola', async () => {
    const b = json(await get('/v1/Loan/100/full'));
    expect(b.data._expand.OID).toMatchObject({ OID: '100', Client: '1' });
    const c = json(await get('/v1/FinObject/100/full'));
    expect(c.children).toEqual([{ model: 'Loan', by: 'OID', path: '/v1/FinObject/100/Loan?by=OID' }]);
  });
  it('bolalar ro‘yxati', async () => {
    const b = json(await get('/v1/BaseClient/1/FinObject'));
    expect(b.data.map((x: any) => x.OID)).toEqual(['100', '101']);
  });
  it('bog‘lanishsiz ota-bola 404, noto‘g‘ri expand 400', async () => {
    expect((await get('/v1/BaseClient/1/Loan')).statusCode).toBe(404);
    expect((await get('/v1/Person?expand=Name')).statusCode).toBe(400);
  });
  it('/v1/_graph', async () => {
    const g = json(await get('/v1/_graph'));
    expect(g.count).toBe(4);
  });
});

describe('graph (chuqur)', () => {
  it('ota zanjiri depth bo‘yicha va bolalar include bilan', async () => {
    const g = json(await get('/v1/Loan/100/graph?depth=3'));
    expect(g.data._parents.OID.Client).toBe('1');
    expect(g.data._parents.OID._parents.Client).toMatchObject({ OID: '1', TaxCode: '***' }); // Loan -> FinObject -> BaseClient
    const shallow = json(await get('/v1/Loan/100/graph?depth=1'));
    expect(shallow.data._parents.OID._parents).toBeUndefined();
    const k = json(await get('/v1/BaseClient/1/graph?depth=0&include=FinObject'));
    expect(k.data._children['FinObject.Client'].data.map((x: any) => x.OID)).toEqual(['100', '101']);
  });
  it('noto‘g‘ri include 400, yo‘q yozuv 404', async () => {
    expect((await get('/v1/BaseClient/1/graph?include=Loan')).statusCode).toBe(400);
    expect((await get('/v1/Loan/999/graph')).statusCode).toBe(404);
  });
});

describe('so‘rovlar', () => {
  it('GCRecord__isnull=true faqat o‘chirilmaganlar', async () => {
    const b = json(await get('/v1/BaseClient?GCRecord__isnull=true'));
    expect(b.data.map((x: any) => x.OID)).toEqual(['1']);
  });
  it('sahifalash: take + after + nextCursor', async () => {
    const a = json(await get('/v1/FinObject?take=2'));
    expect(a.nextCursor).toBe('101');
    const b = json(await get(`/v1/FinObject?take=2&after=${a.nextCursor}`));
    expect(b.data.map((x: any) => x.OID)).toEqual(['102']);
  });
  it('orderBy + after birga rad etiladi, orderBy da nextCursor yo‘q', async () => {
    expect((await get('/v1/FinObject?orderBy=Amount:desc&after=100')).statusCode).toBe(400);
    expect(json(await get('/v1/FinObject?orderBy=Amount:desc&take=1')).nextCursor).toBeUndefined();
  });
  it('select va noma’lum maydon', async () => {
    const a = json(await get('/v1/FinObject?select=Amount'));
    expect(Object.keys(a.data[0]).sort()).toEqual(['Amount', 'OID']);
    expect((await get('/v1/FinObject?Nope=1')).statusCode).toBe(400);
    expect((await get('/v1/FinObject?OID=abc')).statusCode).toBe(400);
  });
  it('xato javobi reqId bilan', async () => {
    const r = json(await get('/v1/FinObject/999'));
    expect(r).toMatchObject({ statusCode: 404, error: 'Topilmadi' });
    expect(typeof r.reqId).toBe('string');
  });
});

describe('raw (primary key‘siz)', () => {
  it('ro‘yxat, o‘qish, maska, cdc yashirin', async () => {
    expect(json(await get('/v1/raw')).data).toEqual(['dbo.LoanUpdateLog', 'CdcCore.ChangedEntity']);
    const r = json(await get('/v1/raw/dbo.LoanUpdateLog?Loan=100&take=5'));
    expect(r.data[0]).toMatchObject({ Loan: '100', NewValue: '5', Blob: '0xAB', PassportNo: '***' });
    expect((await get('/v1/raw/cdc.dbo_X_CT')).statusCode).toBe(404);
  });
  it('noma’lum ustun 400, SQL in’yeksiya parametrlanadi', async () => {
    expect((await get('/v1/raw/dbo.LoanUpdateLog?Nope=1')).statusCode).toBe(400);
    sqlLog.length = 0;
    await get("/v1/raw/dbo.LoanUpdateLog?TableName=x'%3B%20DROP%20TABLE%20a%3B--");
    const q = sqlLog.find((s) => /LoanUpdateLog/.test(s.sql))!;
    expect(q.sql).not.toMatch(/DROP/);
    expect(q.sql).toMatch(/WHERE \[TableName\] = @P1/);
    expect(q.vals).toEqual(["x'; DROP TABLE a;--"]);
  });
});

describe('feed (real vaqt)', () => {
  it('latest va changes kursori', async () => {
    expect(json(await get('/v1/feed/latest')).lsn).toBe('0x00000000000000000002');
    const c = json(await get('/v1/feed/changes?after=0x00000000000000000001'));
    expect(c.data).toHaveLength(1);
    expect(c.nextAfter).toBe('0x00000000000000000002');
    expect((await get('/v1/feed/changes?after=zzz')).statusCode).toBe(400);
  });
});

describe('feed: LSN guruhi hech qachon bo‘linmaydi', () => {
  const L = (n: number) => `0x${String(n).padStart(20, '0')}`;
  afterEach(() => { feedSource.rows = [{ EntityId: 100n, EntityType: 'Loan', Lsn: L(1) }, { EntityId: 1n, EntityType: 'BaseClient', Lsn: L(2) }]; });
  it('take chegarasida guruh o‘rtasida kesilmaydi va hech narsa yo‘qolmaydi', async () => {
    // LSN 1: 1 qator, LSN 2: 3 qator, LSN 3: 1 qator
    feedSource.rows = [
      { EntityId: 1n, EntityType: 'A', Lsn: L(1) },
      ...[1n, 2n, 3n].map((i) => ({ EntityId: i, EntityType: 'B', Lsn: L(2) })),
      { EntityId: 9n, EntityType: 'C', Lsn: L(3) },
    ];
    const seen: string[] = [];
    let after = L(0);
    for (let i = 0; i < 10; i++) {
      const c = json(await get(`/v1/feed/changes?after=${after}&take=2`));
      if (!c.count) break;
      c.data.forEach((r: any) => seen.push(`${r.Lsn}:${r.EntityType}:${r.EntityId}`));
      after = c.nextAfter;
    }
    expect(seen).toHaveLength(5);
    expect(new Set(seen).size).toBe(5); // dublikat ham yo‘q
  });
  it('butun partiya bitta LSN bo‘lsa ham guruh to‘liq qaytadi', async () => {
    feedSource.rows = [1n, 2n, 3n, 4n].map((i) => ({ EntityId: i, EntityType: 'X', Lsn: L(7) }));
    const c = json(await get(`/v1/feed/changes?after=${L(0)}&take=2`));
    expect(c.count).toBe(4);
    expect(c.nextAfter).toBe(L(7));
  });
});

describe('hujjat va monitoring', () => {
  it('/ready va /metrics', async () => {
    expect(json(await get('/ready')).status).toBe('ok');
    const m = await get('/metrics');
    expect(m.statusCode).toBe(200);
    expect(m.body).toMatch(/flexfin_models 6/);
  });
  it('OpenAPI: har model uchun yo‘l, bog‘lanishlar tavsifda', () => {
    const doc = SwaggerModule.createDocument(app, new DocumentBuilder().addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'apiKey').build());
    addModelDocs(doc, registry);
    expect(Object.keys(doc.paths)).toEqual(expect.arrayContaining(['/v1/Loan', '/v1/Loan/{id}/full', '/v1/Person', '/v1/feed/stream', '/health']));
    expect((doc.paths['/v1/Person'] as any).get.description).toMatch(/Passport/);
    expect((doc.paths as any)['/v1/SystemLog']).toBeUndefined();
  });
});

describe('env', () => {
  it('ALLOWED_IPS yoki qisqa API_KEY bo‘lsa ishga tushmaydi', () => {
    expect(() => loadEnv({ DATABASE_URL: 'x', API_KEY: 'short', ALLOWED_IPS: '1.1.1.1' } as any)).toThrow(/API_KEY/);
    expect(() => loadEnv({ DATABASE_URL: 'x', API_KEY: 'k'.repeat(30), ALLOWED_IPS: '' } as any)).toThrow(/ALLOWED_IPS/);
  });
});

describe('SSE oqimi (haqiqiy ulanish)', () => {
  it('after=0 dan hamma o‘zgarish, id=LSN, MAX_STREAMS=1 chegarasi', async () => {
    await app.listen(0, '127.0.0.1');
    const port = (app.getHttpServer().address() as any).port;
    const ac = new AbortController();
    const res = await fetch(`http://127.0.0.1:${port}/v1/feed/stream?after=0`, { headers: H, signal: ac.signal });
    expect(res.status).toBe(200);
    expect(res.headers.get('content-type')).toMatch(/text\/event-stream/);
    expect(res.headers.get('x-accel-buffering')).toBe('no');

    const reader = res.body!.getReader();
    let text = '';
    const t0 = Date.now();
    while (!/0x00000000000000000002/.test(text) && Date.now() - t0 < 5000) {
      const { value, done } = await reader.read();
      if (done) break;
      text += new TextDecoder().decode(value);
    }
    expect(text).toMatch(/event: change/);
    expect(text).toMatch(/id: 0x00000000000000000001/);
    expect(text).toMatch(/"EntityType":"BaseClient"/);

    // ikkinchi oqim: chegaradan oshdi
    const second = await fetch(`http://127.0.0.1:${port}/v1/feed/stream?after=now`, { headers: H });
    expect(second.status).toBe(429);
    ac.abort();
  }, 20000);
});
