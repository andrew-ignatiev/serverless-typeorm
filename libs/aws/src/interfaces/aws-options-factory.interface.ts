import {
  AwsSsmOptions,
  AwsSecretsManagerOptions,
} from './aws-module-options.interface';

export interface AwsSsmOptionsFactory {
  createAwsSsmOptions(): Promise<AwsSsmOptions> | AwsSsmOptions;
}

export interface AwsSecretsManagerOptionsFactory {
  createAwsSecretsManagerOptions():
    | Promise<AwsSecretsManagerOptions>
    | AwsSecretsManagerOptions;
}
