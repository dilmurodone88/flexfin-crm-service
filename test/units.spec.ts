import { catalogAssert } from './helpers';
import { buildWhere, clampTake } from '../src/data/query';
import { ModelEntry } from '../src/registry/registry.types';

const model = {
  name: 'M',
  pk: ['OID'],
  refs: new Map(),
  fields: new Map([
    ['OID', { name: 'OID', type: 'BigInt', kind: 'scalar', isRequired: true, isId: true }],
    ['Name', { name: 'Name', type: 'String', kind: 'scalar', isRequired: false, isId: false }],
    ['Amount', { name: 'Amount', type: 'Int', kind: 'scalar', isRequired: false, isId: false }],
  ]),
} as unknown as ModelEntry;

describe('buildWhere', () => {
  it('operatorlar', () => {
    expect(buildWhere(model, [['Amount__gte', '5'], ['Amount__lt', '9']])).toEqual({ Amount: { gte: 5, lt: 9 } });
    expect(buildWhere(model, [['OID__in', '1,2']])).toEqual({ OID: { in: [1n, 2n] } });
    expect(buildWhere(model, [['Name__contains', 'a']])).toEqual({ Name: { contains: 'a' } });
    expect(buildWhere(model, [['Name__isnull', 'true']])).toEqual({ Name: { equals: null } });
    expect(buildWhere(model, [['take', '5'], ['expand', 'x']])).toEqual({});
  });
  it('xatolar', () => {
    expect(() => buildWhere(model, [['Nope', '1']])).toThrow();
    expect(() => buildWhere(model, [['Amount__contains', '1']])).toThrow();
    expect(() => buildWhere(model, [['Amount__bad', '1']])).toThrow();
    expect(() => buildWhere(model, [['Amount', 'x']])).toThrow();
  });
  it('clampTake', () => {
    expect(clampTake(undefined, 100, 1000)).toBe(100);
    expect(clampTake('5000', 100, 1000)).toBe(1000);
    expect(clampTake('-3', 100, 1000)).toBe(1);
  });
});

describe('raw SQL qo‘riqchisi', () => {
  it('faqat SELECT, ; va izohsiz', () => {
    expect(() => catalogAssert('SELECT 1')).not.toThrow();
    for (const bad of ['DELETE FROM x', 'SELECT 1; DROP TABLE x', 'SELECT 1 -- x', 'SELECT /* x */ 1', 'UPDATE x SET a=1', 'EXEC sp_who']) {
      expect(() => catalogAssert(bad)).toThrow();
    }
  });
});
