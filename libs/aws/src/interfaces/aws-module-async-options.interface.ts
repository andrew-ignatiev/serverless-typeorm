import { ModuleMetadata, Type } from '@nestjs/common/interfaces';
import {
  AwsSsmOptionsFactory,
  AwsSecretsManagerOptionsFactory,
} from './aws-options-factory.interface';
import {
  AwsSsmOptions,
  AwsSecretsManagerOptions,
} from './aws-module-options.interface';

export interface AwsSsmAsyncOptions extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<AwsSsmOptionsFactory>;
  useClass?: Type<AwsSsmOptionsFactory>;
  useFactory?: (...args: any[]) => Promise<AwsSsmOptions> | AwsSsmOptions;
}

export interface AwsSecretsManagerAsyncOptions
  extends Pick<ModuleMetadata, 'imports'> {
  inject?: any[];
  useExisting?: Type<AwsSecretsManagerOptionsFactory>;
  useClass?: Type<AwsSecretsManagerOptionsFactory>;
  useFactory?: (
    ...args: any[]
  ) => Promise<AwsSecretsManagerOptions> | AwsSecretsManagerOptions;
}

export interface AwsModuleAsyncOptions {
  awsSsmAsyncOptions?: AwsSsmAsyncOptions;
  awsSecretsManagerAsyncOptions?: AwsSecretsManagerAsyncOptions;
}
