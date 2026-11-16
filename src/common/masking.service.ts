import { Inject, Injectable } from '@nestjs/common';
import { Env, ENV } from '../config/env';

// Maxfiy ustunlar (parol/hash/token) - HAR DOIM yashiriladi, EXPOSE_PII ga bog'liq emas.
const SECRET_RE = /passw|salt|secret|token|^hash$|^sid$|keycloak/i;
const DEFAULT_PII =
  'passport|pinfl|jshshir|personalcitizen|taxcode|inps|phone|telephone|birth|serial|series|email|address|paymentcard|identificationtelephone';
// Nomi bo'yicha aniqlab bo'lmaydigan, jadvalga xos ustunlar (FlexFin tahlilidan).
const TABLE_PII: Record<string, string[]> = {
  Passport: ['Number', 'RegistrationPlace'],
  TelephoneNumber: ['Number'],
  Person: ['BirthPlace'],
};

export interface MaskShape {
  name: string;
  pk: string[];
  refs: { has(k: string): boolean };
}

@Injectable()
export class MaskingService {
  private readonly piiRe: RegExp;

  constructor(@Inject(ENV) private readonly env: Env) {
    this.piiRe = new RegExp(env.PII_FIELDS_REGEX ?? DEFAULT_PII, 'i');
  }

  /** Maxfiy (parol/hash/token) ustunlar; PK va FK ustunlari bundan mustasno. */
  secretColumns(model: MaskShape & { fields: Map<string, unknown> }): string[] {
    return [...model.fields.keys()].filter((k) => SECRET_RE.test(k) && !model.pk.includes(k) && !model.refs.has(k));
  }

  mask(row: Record<string, unknown>, model: MaskShape): Record<string, unknown> {
    const extra = TABLE_PII[model.name] ?? [];
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(row)) {
      if (Buffer.isBuffer(v)) {
        out[k] = '[binary]';
        continue;
      }
      const isKey = model.pk.includes(k) || model.refs.has(k); // id ustunlari yashirilmaydi
      const secret = SECRET_RE.test(k);
      const pii = !this.env.EXPOSE_PII && !isKey && (this.piiRe.test(k) || extra.includes(k));
      out[k] = v != null && (secret || pii) ? '***' : v;
    }
    return out;
  }
}
