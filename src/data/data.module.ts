import { Module } from '@nestjs/common';
import { MaskingService } from '../common/masking.service';
import { DataController } from './data.controller';
import { DataService } from './data.service';
import { RawController } from './raw.controller';
import { RawService } from './raw.service';

@Module({
  controllers: [RawController, DataController],
  providers: [DataService, RawService, MaskingService],
  exports: [MaskingService],
})
export class DataModule {}
