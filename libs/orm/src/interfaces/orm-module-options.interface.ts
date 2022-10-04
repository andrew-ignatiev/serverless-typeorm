import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export interface OrmItemOptions {
  node: string;
  options: TypeOrmModuleOptions;
}

export type OrmOptions = Array<OrmItemOptions>;

export interface OrmModuleOptions {
  ormOptions: OrmOptions;
}
