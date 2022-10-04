import { ApiProperty } from '@nestjs/swagger';
import { ApiEventsDto } from './api-events.dto';
import { ApiSuccessResponseInterface } from '@app-libs/api';

export class ApiSuccessResponseDto
  implements ApiSuccessResponseInterface<ApiEventsDto>
{
  @ApiProperty({
    type: () => ApiEventsDto,
  })
  data: ApiEventsDto;

  @ApiProperty()
  success: true;
}
