import { z } from 'zod';

const csv = (def = '') =>
  z
    .string()
    .default(def)
    .transform((s) =>
      s
        .split(',')
        .map((x) => x.trim())
        .filter(Boolean),
    );

const bool = (def: 'true' | 'false') =>
  z
    .enum(['true', 'false'])
    .default(def)
    .transform((v) => v === 'true');

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('production'),
  PORT: z.coerce.number().int().min(1).max(65535).default(8085),
  HOST: z.string().default('0.0.0.0'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL kerak'),
  API_KEY: z.string().min(24, 'API_KEY kamida 24 belgi bo‘lsin'),
  ALLOWED_IPS: csv().refine((a) => a.length > 0, 'ALLOWED_IPS bo‘sh: kamida bitta IP kiriting'),
  TRUSTED_PROXIES: csv(),
  BLOCK_MODELS: csv('SystemLog,SystemLogValues').transform((a) => a.map((s) => s.toLowerCase())),
  EXPOSE_PII: bool('false'),
  PII_FIELDS_REGEX: z.string().optional(),
  MAX_TAKE: z.coerce.number().int().min(1).max(10000).default(1000),
  DEFAULT_TAKE: z.coerce.number().int().min(1).default(100),
  MAX_CONCURRENT: z.coerce.number().int().min(1).default(8),
  MAX_STREAMS: z.coerce.number().int().min(0).default(10),
  DB_TIMEOUT_MS: z.coerce.number().int().min(1000).default(25000),
  FEED_POLL_MS: z.coerce.number().int().min(200).default(2000),
  RATE_LIMIT_PER_MIN: z.coerce.number().int().min(1).default(600),
  LOG_LEVEL: z.enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']).default('info'),
  LOG_FILE: bool('false'),
  LOG_DIR: z.string().default('logs'),
  LOG_RETENTION_FILES: z.coerce.number().int().min(1).default(30),
  SWAGGER_ENABLED: bool('true'),
  COMPRESS: bool('true'), // nginx orqasida false (nginx siqadi)
});

export type Env = z.infer<typeof envSchema>;
export const ENV = Symbol('ENV');

export function loadEnv(source: NodeJS.ProcessEnv = process.env): Env {
  const parsed = envSchema.safeParse(source);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    throw new Error(`Muhit o‘zgaruvchilari noto‘g‘ri:\n${msg}`);
  }
  return parsed.data;
}
