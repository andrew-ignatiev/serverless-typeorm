import {
  CACHE,
  CACHE_HEADER_CONTROL,
  CACHE_HEADER_EXPIRES,
  CACHE_HEADER_PRAGMA,
} from '@app-libs/api';
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { tap } from 'rxjs/operators';
import { Response } from 'express';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class ApiCacheHeadersInterceptor implements NestInterceptor {
  constructor(private readonly reflector: Reflector) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(tap(() => this.setCacheHeaders(context)));
  }

  /**
   * Sets cache headers if handler has annotation with defined ttl >= 0
   */
  setCacheHeaders(context: ExecutionContext) {
    const res = context.switchToHttp().getResponse<Response>();
    const ttl = this.reflector.get<number>(CACHE, context.getHandler());

    if (ttl > 0) {
      res.setHeader(CACHE_HEADER_PRAGMA, 'cache');
      res.setHeader(CACHE_HEADER_EXPIRES, this.getExpires(ttl));
      res.setHeader(CACHE_HEADER_CONTROL, `public, max-age=${ttl}`);
    }
  }

  /**
   * Returns expires date UTC string
   */
  getExpires(ttl: number) {
    const date = new Date();
    date.setTime(date.getTime() + ttl * 1000);

    return date.toUTCString();
  }
}
