import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { Qs } from '../common/types';
import { RawService } from './raw.service';

@ApiTags('raw')
@ApiSecurity('apiKey')
@Controller('v1/raw')
export class RawController {
  constructor(private readonly raw: RawService) {}

  @Get()
  @ApiOperation({ summary: "Primary key'siz jadvallar ro'yxati" })
  tables() {
    return this.raw.tables();
  }

  @Get(':table')
  @ApiOperation({ summary: "Primary key'siz jadval (take, skip, Ustun=qiymat)" })
  read(@Param('table') table: string, @Query() query: Qs) {
    return this.raw.read(table, query);
  }
}
