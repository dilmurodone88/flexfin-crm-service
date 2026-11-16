import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiExcludeController } from '@nestjs/swagger';
import { Qs, qget } from '../common/types';
import { DataService } from './data.service';
import { parseExpand } from './query';

/**
 * Har modelga bitta umumiy marshrut to'plami (modellar ro'yxati ishga tushganda bazadan olinadi).
 * Aniq hujjat: /docs (Swagger) va /v1/models.
 */
// Hujjatda umumiy {model} yo'llari o'rniga HAR MODEL uchun aniq yo'l ko'rsatiladi (meta/openapi.ts).
@ApiExcludeController()
@Controller('v1')
export class DataController {
  constructor(private readonly data: DataService) {}

  @Get(':model')
  list(@Param('model') model: string, @Query() query: Qs) {
    return this.data.list(this.data.model(model), query);
  }

  @Get(':model/:id')
  one(@Param('model') model: string, @Param('id') id: string, @Query() query: Qs) {
    const m = this.data.model(model);
    return this.data.one(m, id, parseExpand(m, qget(query, 'expand')));
  }

  @Get(':model/:id/graph')
  graph(@Param('model') model: string, @Param('id') id: string, @Query() query: Qs) {
    return this.data.graph(this.data.model(model), id, query);
  }

  @Get(':model/:id/full')
  full(@Param('model') model: string, @Param('id') id: string) {
    return this.data.full(this.data.model(model), id);
  }

  @Get(':model/:id/:child')
  children(@Param('model') model: string, @Param('id') id: string, @Param('child') child: string, @Query() query: Qs) {
    return this.data.children(this.data.model(model), id, child, query);
  }
}
