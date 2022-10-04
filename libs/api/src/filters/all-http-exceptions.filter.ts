import { format } from 'util';
import { isType } from '@app-libs/api/helpers';
import { AxiosError } from 'axios';
import { ApiErrorReason } from '@app-libs/api/interfaces';
import { Request, Response } from 'express';
import { ERROR, INTERNAL_SERVER_ERROR } from '@app-libs/api/constants';
import { stackWithCauses, getErrorCause } from 'pony-cause';
import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';

@Catch()
export class AllHttpExceptionsFilter implements ExceptionFilter {
  static LOG_ERROR_DEBUG = 'ERROR: %j';

  private readonly logger = new Logger(AllHttpExceptionsFilter.name);

  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const res = ctx.getResponse<Response>();
    const req = ctx.getRequest<Request>();

    const reason = this.getOriginalErrorReason(exception);
    const body = {
      message: reason.message,
      statusCode: reason.code,
      success: false,
    };

    res.status(reason.code).json(body);

    // Debug error
    const debug = {
      stack: stackWithCauses(exception),
      debug: {
        reason,
        request: {
          url: req?.url,
          body: req?.body,
          query: req?.query,
          params: req?.params,
          headers: req?.headers,
        },
        response: {
          body,
          headers: res.getHeaders(),
        },
      },
      tag: ERROR,
    };

    this.logger.error(format(AllHttpExceptionsFilter.LOG_ERROR_DEBUG, debug));
  }

  /**
   * Returns original Error reason
   */
  private getOriginalErrorReason(error: Error): ApiErrorReason {
    const cause = getErrorCause(error);
    if (!cause) {
      if (isType<AxiosError>(error, 'isAxiosError')) {
        if (error.response?.config.url) {
          error.response.config.url = error.response.config.url.replace(
            /:\/\/.+@/,
            '://',
          );
        }

        return {
          code: HttpStatus.INTERNAL_SERVER_ERROR,
          message: INTERNAL_SERVER_ERROR,
          ctx: { ...error.toJSON(), response: error.response?.data },
        };
      } else if (error instanceof HttpException) {
        const message =
          typeof error.getResponse() === 'string'
            ? error.getResponse()
            : (error.getResponse() as any).message ?? INTERNAL_SERVER_ERROR;

        return {
          message,
          code: error.getStatus(),
          ctx: { response: error.getResponse() },
        };
      }

      return {
        code: HttpStatus.INTERNAL_SERVER_ERROR,
        message: !!error.message ? error.message : INTERNAL_SERVER_ERROR,
        ctx: null,
      };
    }

    return this.getOriginalErrorReason(cause);
  }
}
