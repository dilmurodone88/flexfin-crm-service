import { randomUUID } from 'node:crypto';

/** Bir so'rov uchun bitta ID: kiruvchi x-request-id (xavfsiz uzunlikda) yoki yangi UUID. */
export function requestId(req: any): string {
  if (req.__rid) return req.__rid;
  const h = String(req.headers?.['x-request-id'] ?? '')
    .replace(/[^\w.:-]/g, '')
    .slice(0, 64);
  req.__rid = h || randomUUID();
  return req.__rid;
}
