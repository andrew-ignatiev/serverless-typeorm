import { Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsNumber } from 'class-validator';

export class ApiQueryFilterDto {
  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    value.split(',').map((v) => (!!v ? Math.abs(Number(v)) : null)),
  )
  @ApiProperty({
    type: String,
    example: '1,11,13',
  })
  private readonly store_ids: number[];

  @IsArray()
  @IsNumber({}, { each: true })
  @Transform(({ value }) =>
    value.split(',').map((v) => (!!v ? Math.abs(Number(v)) : null)),
  )
  @ApiProperty({
    type: String,
    example: '1,2,3',
  })
  private readonly type_ids: number[];

  get storeIds() {
    return this.store_ids;
  }

  get typeIds() {
    return this.type_ids;
  }
}
