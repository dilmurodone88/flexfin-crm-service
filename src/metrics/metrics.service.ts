import { Injectable } from '@nestjs/common';
import { Counter, Gauge, Histogram, Registry, collectDefaultMetrics } from 'prom-client';
import { FeedService } from '../feed/feed.service';
import { PrismaService } from '../prisma/prisma.service';
import { RegistryService } from '../registry/registry.service';

@Injectable()
export class MetricsService {
  readonly registry = new Registry();
  private readonly requests = new Counter({
    name: 'flexfin_http_requests_total',
    help: "HTTP so'rovlar",
    labelNames: ['method', 'route', 'status'],
    registers: [this.registry],
  });
  private readonly duration = new Histogram({
    name: 'flexfin_http_request_duration_ms',
    help: "So'rov davomiyligi (ms)",
    labelNames: ['route'],
    buckets: [5, 10, 25, 50, 100, 250, 500, 1000, 2500, 5000, 10000],
    registers: [this.registry],
  });

  constructor(
    private readonly prisma: PrismaService,
    private readonly feed: FeedService,
    private readonly models: RegistryService,
  ) {
    collectDefaultMetrics({ register: this.registry, prefix: 'flexfin_' });
    const self = this;
    new Gauge({
      name: 'flexfin_sse_streams',
      help: 'Ochiq SSE oqimlar',
      registers: [this.registry],
      collect() {
        this.set(self.feed.streams);
      },
    });
    new Gauge({
      name: 'flexfin_models',
      help: 'Ochiq modellar soni',
      registers: [this.registry],
      collect() {
        this.set(self.models.models.size);
      },
    });
    new Gauge({
      name: 'flexfin_db_transient_errors',
      help: 'Qayta urinish talab qilgan baza xatolari',
      registers: [this.registry],
      collect() {
        this.set(self.prisma.dbErrors);
      },
    });
  }

  observe(method: string, route: string, status: number, ms: number) {
    this.requests.inc({ method, route, status: String(status) });
    this.duration.observe({ route }, ms);
  }

  render() {
    return this.registry.metrics();
  }
}
