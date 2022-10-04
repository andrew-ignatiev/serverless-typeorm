import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { EventService } from '../../common/database';
import { ApiEventDto, ApiQueryFilterDto } from './dto';

@Injectable()
export class ApiEventService {
  constructor(private readonly categoryEventService: EventService) {}

  /**
   * Returns category events for given filter params
   */
  async findByParams(params: ApiQueryFilterDto) {
    const events = (await this.categoryEventService.findByParams(params)).map(
      (v) => plainToClass(ApiEventDto, v),
    );

    return { events };
  }
}
