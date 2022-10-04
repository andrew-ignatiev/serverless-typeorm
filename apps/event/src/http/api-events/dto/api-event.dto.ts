import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { getUnixTimestamp } from '@app-libs/api';

@Exclude()
export class ApiEventDto {
  @ApiProperty({ example: 192 })
  @Expose()
  @Transform(({ obj }) => Number(obj.id))
  id: number;

  @ApiProperty({ example: 1 })
  @Expose()
  @Transform(({ obj }) => Number(obj.storeId))
  storeId: number;

  @ApiProperty({ example: 5 })
  @Expose()
  @Transform(({ obj }) => Number(obj.typeId))
  typeId: number;

  @ApiProperty({ example: 'Test event' })
  @Expose()
  @Transform(({ obj }) => obj.name)
  name: string;

  @ApiProperty({ example: 1647844158 })
  @Expose()
  @Transform(({ obj }) => getUnixTimestamp(obj.startDate))
  startDate: number;

  @ApiProperty({ example: 1647844168 })
  @Expose()
  @Transform(({ obj }) => getUnixTimestamp(obj.endDate))
  endDate: number;
}
