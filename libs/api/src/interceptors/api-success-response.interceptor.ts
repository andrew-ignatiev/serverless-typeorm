import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ApiSuccessResponseInterface } from '../interfaces';

@Injectable()
export class ApiSuccessResponseInterceptor<T>
  implements NestInterceptor<T, ApiSuccessResponseInterface<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiSuccessResponseInterface<T>> {
    return next.handle().pipe(map((data) => ({ data, success: true })));
  }
}
