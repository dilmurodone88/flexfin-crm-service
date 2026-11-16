import { Controller, Get, Inject } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService, HealthIndicatorService } from '@nestjs/terminus';
import { CatalogService } from '../catalog/catalog.service';
import { Public } from '../common/public.decorator';
import { PrismaService } from '../prisma/prisma.service';
import { RegistryService } from '../registry/registry.service';

export const SERVICE_NAME = 'flexfin-crm-service';
export const SERVICE_VERSION = '2.1.1';

@ApiTags('health')
@Controller()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly indicator: HealthIndicatorService,
    private readonly catalog: CatalogService,
    private readonly registry: RegistryService,
    @Inject(PrismaService) private readonly prisma: PrismaService,
  ) {}

  @Public()
  @Get('health')
  @ApiOperation({ summary: 'Liveness: jarayon tirik (kalitsiz, bazaga tegmaydi)' })
  live() {
    return {
      ok: true,
      service: SERVICE_NAME,
      version: SERVICE_VERSION,
      models: this.registry.models.size,
      relations: this.registry.relationCount,
      rawTables: this.registry.rawTables.size,
      feed: this.registry.feedAvailable,
      catalog: this.registry.catalogLoaded,
    };
  }

  @Get('ready')
  @HealthCheck()
  @ApiSecurity('apiKey')
  @ApiOperation({ summary: 'Readiness: bazaga ulanish (SELECT 1)' })
  ready() {
    return this.health.check([
      async () => {
        const c = this.indicator.check('catalog');
        if (!this.registry.catalogLoaded) return c.down({ message: 'katalog hali o‘qilmagan (qayta uriniladi)' });
        const i = this.indicator.check('database');
        try {
          await this.prisma.run(() => this.catalog.select('SELECT 1 AS ok'));
          return i.up();
        } catch (e: any) {
          return i.down({ message: String(e.message).slice(0, 200) });
        }
      },
    ]);
  }
}
