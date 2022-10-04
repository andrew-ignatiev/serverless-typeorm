import { ApiProperty } from '@nestjs/swagger';
import { ApiEventDto } from './api-event.dto';

export class ApiEventsDto {
  @ApiProperty({
    type: () => [ApiEventDto],
  })
  events: ApiEventDto[];
}
