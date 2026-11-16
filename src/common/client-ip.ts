const strip = (ip: string | undefined) => (ip ?? '').replace(/^::ffff:/, '');

/** Haqiqiy mijoz IP'si: socket manzili ishonchli proksi bo'lsagina X-Forwarded-For'dan olinadi. */
export function clientIp(remote: string | undefined, xff: string | string[] | undefined, trusted: readonly string[]): string {
  const sock = strip(remote);
  if (trusted.includes(sock)) {
    const first = strip(String(Array.isArray(xff) ? xff[0] : (xff ?? '')).split(',')[0].trim());
    if (first) return first;
  }
  return sock;
}
