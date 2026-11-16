import 'reflect-metadata';
// BigInt JSON'ga satr bo'lib chiqadi (Decimal o'zi satr beradi).
(BigInt.prototype as any).toJSON = function () {
  return this.toString();
};

import compress from '@fastify/compress';
import helmet from '@fastify/helmet';
import { NestFactory } from '@nestjs/core';
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { normalizeIp } from './common/auth.guard';
import { requestId } from './common/request-id';
import { Env, ENV, loadEnv } from './config/env';
import { SERVICE_NAME, SERVICE_VERSION } from './health/health.controller';
import { applyHooks } from './hooks';
import { addModelDocs } from './meta/openapi';
import { RegistryService } from './registry/registry.service';

export async function createApp(env: Env = loadEnv()): Promise<NestFastifyApplication> {
  const adapter = new FastifyAdapter({
    trustProxy: env.TRUSTED_PROXIES.length ? env.TRUSTED_PROXIES : false,
    genReqId: (req: any) => requestId(req),
    keepAliveTimeout: 65_000, // nginx (60s) dan katta
    requestTimeout: 30_000,
    bodyLimit: 1024,
  });
  const app = await NestFactory.create<NestFastifyApplication>(AppModule, adapter, { bufferLogs: true });
  app.useLogger(app.get(Logger));
  app.enableShutdownHooks();

  await app.register(helmet as any, { contentSecurityPolicy: false });
  // SSE siqilmasin: faqat json/text
  if (env.COMPRESS) await app.register(compress as any, { encodings: ['br', 'gzip', 'deflate'], threshold: 1024, customTypes: /^(application\/json|text\/plain)/ });

  applyHooks(app);
  const fastify = app.getHttpAdapter().getInstance();

  await app.init(); // registry modellarni yuklaydi

  if (env.SWAGGER_ENABLED) {
    const config = new DocumentBuilder()
      .setTitle('flexfin-crm-service')
      .setVersion(SERVICE_VERSION)
      .setDescription(
        [
          'FlexFin (SQL Server) bazasi uchun **faqat-o‘qiydigan** REST API.',
          '',
          '- Autentifikatsiya: `x-api-key` sarlavhasi + IP ro‘yxati.',
          '- Bog‘lanishlar: `?expand=Ustun`, `/{id}/full`, `/{id}/{Bola}`.',
          '- Real vaqt: `/v1/feed/stream` (SSE), `/v1/feed/changes` (kursor).',
          '- Maxfiy ustunlar (parol/hash) doim `***`; shaxsiy ma’lumot default yashirin.',
        ].join('\n'),
      )
      .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'apiKey')
      .build();
    const doc = SwaggerModule.createDocument(app, config);
    addModelDocs(doc, app.get(RegistryService));
    // /docs faqat ruxsat etilgan IP'lardan
    fastify.addHook('onRequest', async (req, reply) => {
      if (/^\/docs/.test(req.url) && !env.ALLOWED_IPS.includes(normalizeIp(req.ip))) {
        await reply.code(403).send({ statusCode: 403, error: 'IP ruxsat etilmagan' });
      }
    });
    SwaggerModule.setup('docs', app, doc, { jsonDocumentUrl: 'docs-json', swaggerOptions: { persistAuthorization: true, docExpansion: 'none' } });
  }
  return app;
}

async function bootstrap() {
  const env = loadEnv();
  const app = await createApp(env);
  await app.listen(env.PORT, env.HOST);
  app.get(Logger).log(`${SERVICE_NAME} ${SERVICE_VERSION}: http://${env.HOST}:${env.PORT} (docs: /docs)`);
}

if (require.main === module) {
  bootstrap().catch((e) => {
    console.error(e);
    process.exit(1);
  });
}
export { ENV };
