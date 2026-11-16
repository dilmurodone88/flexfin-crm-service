import { Module } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { LoggerModule } from 'nestjs-pino';
import { AllExceptionsFilter } from './common/all-exceptions.filter';
import { AuthGuard } from './common/auth.guard';
import { clientIp } from './common/client-ip';
import { requestId } from './common/request-id';
import { CatalogModule } from './catalog/catalog.module';
import { ConfigModule } from './config/config.module';
import { Env, ENV } from './config/env';
import { DataModule } from './data/data.module';
import { FeedModule } from './feed/feed.module';
import { HealthModule } from './health/health.module';
import { MetaModule } from './meta/meta.module';
import { MetricsModule } from './metrics/metrics.module';
import { PrismaModule } from './prisma/prisma.module';
import { RegistryModule } from './registry/registry.module';

@Module({
  imports: [
    ConfigModule,
    LoggerModule.forRootAsync({
      inject: [ENV],
      useFactory: (env: Env) => {
        const targets: any[] = [{ target: 'pino/file', level: env.LOG_LEVEL, options: { destination: 1 } }];
        if (env.LOG_FILE) {
          targets.push({
            target: 'pino-roll',
            level: env.LOG_LEVEL,
            options: { file: `${env.LOG_DIR}/access`, frequency: 'daily', dateFormat: 'yyyy-MM-dd', mkdir: true, limit: { count: env.LOG_RETENTION_FILES }, extension: '.log' },
          });
        }
        return {
          pinoHttp: {
            level: env.LOG_LEVEL,
            genReqId: (req: any) => requestId(req),
            autoLogging: { ignore: (req: any) => req.url === '/health' },
            redact: { paths: ['req.headers["x-api-key"]', 'req.headers.authorization'], censor: '***' },
            // Maxfiylik: so'rov qiymatlari (masalan pasport raqami) logga yozilmaydi, faqat parametr nomlari.
            serializers: {
              req: (req: any) => {
                const [path, qs = ''] = String(req.url).split('?');
                return { id: req.id, method: req.method, path, params: [...new URLSearchParams(qs).keys()].join(','), ip: clientIp(req.remoteAddress, req.headers?.['x-forwarded-for'], env.TRUSTED_PROXIES) };
              },
              res: (res: any) => ({ status: res.statusCode }),
            },
            customLogLevel: (_req: any, res: any, err?: Error) => (err || res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info'),
            transport: env.NODE_ENV === 'test' ? undefined : { targets },
          },
        };
      },
    }),
    ThrottlerModule.forRootAsync({
      inject: [ENV],
      useFactory: (env: Env) => [{ ttl: 60_000, limit: env.RATE_LIMIT_PER_MIN }],
    }),
    PrismaModule,
    CatalogModule,
    RegistryModule,
    DataModule,
    MetaModule,
    FeedModule,
    HealthModule,
    MetricsModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: AuthGuard },
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: AllExceptionsFilter },
  ],
})
export class AppModule {}
