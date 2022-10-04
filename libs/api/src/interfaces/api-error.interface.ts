type JsonApiError = {
  code: number;
  errors: Array<unknown>;
  message: string;
};

export interface ApiErrorInterface {
  toJSON(): JsonApiError;
  toString(): string;
}

export interface ApiErrorReason {
  code: number;
  message: string | string[];
  ctx: any;
}
