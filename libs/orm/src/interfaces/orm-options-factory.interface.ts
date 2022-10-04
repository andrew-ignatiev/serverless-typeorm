import { OrmOptions } from './orm-module-options.interface';

export interface OrmOptionsFactory {
  createOrmOptions(): Promise<OrmOptions> | OrmOptions;
}
