import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from '@nestjs/common';
import type { FastifyReply, FastifyRequest } from 'fastify';

/** Barcha xatolar bir xil shaklda: { statusCode, error, reqId }. Ichki tafsilotlar mijozga chiqmaydi. */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger('Errors');

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const reply = ctx.getResponse<FastifyReply>();
    const req = ctx.getRequest<FastifyRequest>();
    const reqId = String(req.id);

    let status = 500;
    let message = 'Ichki xato';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const r = exception.getResponse();
      message = typeof r === 'string' ? r : String((r as any).message ?? exception.message);
    } else {
      const code = (exception as any)?.code;
      if (code === 'P2025') status = 404;
      else if (['P1001', 'P1002', 'P1008', 'P1017', 'P2024'].includes(code)) {
        status = 503;
        message = 'Baza vaqtincha mavjud emas';
      }
      this.logger.error({ reqId, err: String((exception as any)?.message ?? exception) }, 'kutilmagan xato');
    }
    if (reply.sent || reply.raw.headersSent) return;
    void reply.status(status).header('x-request-id', reqId).send({ statusCode: status, error: message, reqId });
  }
}
