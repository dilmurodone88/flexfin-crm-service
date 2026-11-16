export type Qs = Record<string, string | string[] | undefined>;

export const qget = (q: Qs, key: string): string | undefined => {
  const v = q[key];
  return Array.isArray(v) ? v[v.length - 1] : v;
};

export const qentries = (q: Qs): [string, string][] =>
  Object.entries(q)
    .filter(([, v]) => v !== undefined)
    .map(([k, v]) => [k, Array.isArray(v) ? (v[v.length - 1] as string) : (v as string)]);
