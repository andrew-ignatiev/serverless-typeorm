import { ApiProperty } from '@nestjs/swagger';
import { ApiErrorResponseInterface } from '@app-libs/api';

export class ApiBadRequestResponseDto implements ApiErrorResponseInterface {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({
    example: ['Validation failed (numeric string is expected)'],
  })
  message: string[];

  @ApiProperty({ example: 400 })
  statusCode: number;
}

export class ApiInternalServerErrorResponseDto
  implements ApiErrorResponseInterface
{
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 'Internal Server Error' })
  message: string;

  @ApiProperty({ example: 500 })
  statusCode: number;
}
