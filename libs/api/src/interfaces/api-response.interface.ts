export interface ApiErrorResponseInterface {
  success: boolean;
  message: string | Array<string | Record<string, unknown>>;
  statusCode: number;
}

export class ApiSuccessResponseInterface<T> {
  data: T;
  success: boolean;
}
