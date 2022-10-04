import { applyDecorators } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import {
  ApiBadRequestResponseDto,
  ApiInternalServerErrorResponseDto,
  ApiSuccessResponseDto,
} from './dto';

export const ApiEventResponse = () => {
  return applyDecorators(
    ApiOkResponse({
      type: ApiSuccessResponseDto,
      description: 'Success',
    }),
    ApiBadRequestResponse({
      type: ApiBadRequestResponseDto,
      description: 'Error: Bad Request',
    }),
    ApiInternalServerErrorResponse({
      type: ApiInternalServerErrorResponseDto,
      description: 'Error: Internal Server Error',
    }),
  );
};
