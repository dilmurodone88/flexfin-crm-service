import { Controller, Get, Headers, Query, Sse } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiSecurity, ApiTags } from '@nestjs/swagger';
import { from, mergeMap } from 'rxjs';
import { FeedService } from './feed.service';

@ApiTags('feed')
@ApiSecurity('apiKey')
@Controller('v1/feed')
export class FeedController {
  constructor(private readonly feed: FeedService) {}

  @Get('changes')
  @ApiOperation({ summary: "O'zgarishlar (kursor): after=<LSN> dan keyingilar" })
  @ApiQuery({ name: 'after', required: false, description: '0x + 20 hex; default boshidan' })
  @ApiQuery({ name: 'take', required: false })
  changes(@Query('after') after?: string, @Query('take') take?: string) {
    return this.feed.changes(after, take);
  }

  @Get('latest')
  @ApiOperation({ summary: "Eng so'nggi LSN (shundan boshlab kuzatish uchun)" })
  latest() {
    return this.feed.latest();
  }

  @Sse('stream')
  @ApiOperation({ summary: "Real vaqt (Server-Sent Events). after=now|0|<LSN>; Last-Event-ID bilan davom etadi" })
  @ApiQuery({ name: 'after', required: false })
  stream(@Query('after') after?: string, @Headers('last-event-id') lastEventId?: string) {
    return from(this.feed.open(after ?? lastEventId)).pipe(mergeMap((o) => o));
  }
}
