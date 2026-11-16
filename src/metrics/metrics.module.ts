import { Global, Module } from '@nestjs/common';
import { FeedModule } from '../feed/feed.module';
import { MetricsController } from './metrics.controller';
import { MetricsService } from './metrics.service';

@Global()
@Module({ imports: [FeedModule], controllers: [MetricsController], providers: [MetricsService], exports: [MetricsService] })
export class MetricsModule {}
