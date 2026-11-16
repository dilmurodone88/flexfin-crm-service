import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { timingSafeEqual } from 'node:crypto';
import { Env, ENV } from '../config/env';
import { IS_PUBLIC } from './public.decorator';

export const normalizeIp = (ip: string | undefined) => (ip ?? '').replace(/^::ffff:/, '');

/** Har so'rov: IP ro'yxati + x-api-key (vaqt bo'yicha doimiy solishtirish). Faqat GET/HEAD. */
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    @Inject(ENV) private readonly env: Env,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    if (this.reflector.getAllAndOverride<boolean>(IS_PUBLIC, [context.getHandler(), context.getClass()])) return true;
    const req = context.switchToHttp().getRequest();
    if (!this.env.ALLOWED_IPS.includes(normalizeIp(req.ip))) throw new ForbiddenException('IP ruxsat etilmagan');
    const given = Buffer.from(String(req.headers['x-api-key'] ?? ''));
    const want = Buffer.from(this.env.API_KEY);
    if (given.length !== want.length || !timingSafeEqual(given, want)) throw new UnauthorizedException("API kalit noto'g'ri");
    return true;
  }
}
