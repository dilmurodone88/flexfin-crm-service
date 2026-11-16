import { Controller, Get, Header } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { MetricsService } from './metrics.service';

@ApiTags('health')
@ApiSecurity('apiKey')
@Controller('metrics')
export class MetricsController {
  constructor(private readonly metrics: MetricsService) {}

  @Get()
  @Header('content-type', 'text/plain; version=0.0.4')
  @ApiOperation({ summary: 'Prometheus metrikalari' })
  render() {
    return this.metrics.render();
  }
}
