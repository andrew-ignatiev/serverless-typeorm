import { of } from 'rxjs';
import { format } from 'util';
import { stackWithCauses } from 'pony-cause';
import { BaseRpcExceptionFilter, RpcException } from '@nestjs/microservices';
import { ArgumentsHost, Catch, HttpStatus, Logger } from '@nestjs/common';
import { ERROR, INTERNAL_SERVER_ERROR } from '@app-libs/api/constants';

@Catch()
export class AllRpcExceptionsFilter extends BaseRpcExceptionFilter {
  static LOG_ERROR_DEBUG = 'ERROR: %j';

  private readonly logger = new Logger(AllRpcExceptionsFilter.name);

  catch(exception: any, _host: ArgumentsHost) {
    const err =
      exception instanceof RpcException ? exception.getError() : exception;

    const debug = {
      stack: stackWithCauses(exception),
      tag: ERROR,
    };

    this.logger.error(format(AllRpcExceptionsFilter.LOG_ERROR_DEBUG, debug));

    return of({
      message: (err?.message || null) ?? INTERNAL_SERVER_ERROR,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      success: false,
    });
  }
}
