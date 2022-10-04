import { ApiTags } from '@nestjs/swagger';
import {
  Get,
  Query,
  UsePipes,
  Controller,
  UseFilters,
  ValidationPipe,
  UseInterceptors,
} from '@nestjs/common';
import {
  AllHttpExceptionsFilter,
  ApiCacheHeadersInterceptor,
  ApiSuccessResponseInterceptor,
  Cache,
} from '@app-libs/api';
import { ApiQueryFilterDto } from './dto';
import { ApiEventService } from './api-event.service';
import { ApiEventResponse } from './api-event.response';

@ApiTags('events')
@UseInterceptors(ApiSuccessResponseInterceptor, ApiCacheHeadersInterceptor)
@UseFilters(new AllHttpExceptionsFilter())
@Controller('events')
export class ApiEventController {
  constructor(private readonly service: ApiEventService) {}

  @Get()
  @Cache(3600)
  @ApiEventResponse()
  @UsePipes(new ValidationPipe({ transform: true }))
  async categoryEvents(@Query() filter: ApiQueryFilterDto) {
    return this.service.findByParams(filter);
  }
}
