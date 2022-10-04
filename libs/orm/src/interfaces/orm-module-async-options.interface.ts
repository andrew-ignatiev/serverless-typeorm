import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import { OrmOptionsFactory } from './orm-options-factory.interface';
import { OrmOptions } from './orm-module-options.interface';

export interface OrmAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<OrmOptionsFactory>;
  useClass?: Type<OrmOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<OrmOptions> | OrmOptions;
}

export interface OrmModuleAsyncOptions {
  ormAsyncNodes: string[];
  ormAsyncOptions: OrmAsyncOptions;
}
