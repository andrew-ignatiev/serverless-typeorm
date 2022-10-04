export type Awaited<T> = T extends PromiseLike<infer U> ? Awaited<U> : T;
export type Nullable<T> = T | null | undefined;
export type ExcludeMethods<T> = Pick<
  T,
  // eslint-disable-next-line @typescript-eslint/ban-types
  { [K in keyof T]: T[K] extends Function ? never : K }[keyof T]
>;
export type PrimitiveType = string | boolean | number | Array<PrimitiveType>;
export type Numeric = number | string;
