import type { NestFastifyApplication } from '@nestjs/platform-fastify';
import { MetricsService } from './metrics/metrics.service';

/** Fastify hook'lari: x-request-id javobda, metrikalar (route shabloni bo'yicha: yuqori kardinallikdan saqlaydi). */
export function applyHooks(app: NestFastifyApplication): void {
  const fastify = app.getHttpAdapter().getInstance();
  const metrics = app.get(MetricsService);
  fastify.addHook('onSend', async (req, reply) => {
    reply.header('x-request-id', String(req.id));
  });
  fastify.addHook('onResponse', async (req, reply) => {
    metrics.observe(req.method, req.routeOptions?.url ?? 'unmatched', reply.statusCode, reply.elapsedTime);
  });
}
