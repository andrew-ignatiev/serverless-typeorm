import { AwsService } from './aws.service';
import { ConfigModule } from '@nestjs/config';
import { ServerlessModule } from '@app-libs/sls';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  AwsModuleOptions,
  AwsSsmAsyncOptions,
  AwsSsmOptionsFactory,
  AwsModuleAsyncOptions,
  AwsSecretsManagerAsyncOptions,
  AwsSecretsManagerOptionsFactory,
} from '@app-libs/aws/interfaces';
import {
  AWS_SSM_OPTIONS,
  AWS_SSM_PARAMETERS,
  AWS_SECRETS_MANAGER_OPTIONS,
  AWS_SECRETS_MANAGER_PARAMETERS,
} from '@app-libs/aws/constants';

@Module({})
export class AwsModule {
  static AWS_SSM_PARAMETERS_FACTORY = {
    provide: AWS_SSM_PARAMETERS,
    useFactory: async (AwsService) => {
      return AwsService.getParametersFromSSM();
    },
    inject: [AwsService],
  };

  static AWS_SECRETS_MANAGER_PARAMETERS_FACTORY = {
    provide: AWS_SECRETS_MANAGER_PARAMETERS,
    useFactory: async (AwsService) => {
      return AwsService.getParametersFromSecretsManager();
    },
    inject: [AwsService],
  };

  /**
   * Registers a configured AwsModule for import into the app module
   * using at least one static awsSsmOptions or awsSecretsManagerOptions
   */
  static forRoot({
    awsSsmOptions,
    awsSecretsManagerOptions,
  }: AwsModuleOptions): DynamicModule {
    const providers: DynamicModule['providers'] = [
      {
        provide: AWS_SSM_OPTIONS,
        useValue: awsSsmOptions ?? {},
      },
      {
        provide: AWS_SECRETS_MANAGER_OPTIONS,
        useValue: awsSecretsManagerOptions ?? {},
      },
      AwsModule.AWS_SSM_PARAMETERS_FACTORY,
      AwsModule.AWS_SECRETS_MANAGER_PARAMETERS_FACTORY,
      AwsService,
    ];

    const exports: DynamicModule['exports'] = [
      AwsService,
      AwsModule.AWS_SSM_PARAMETERS_FACTORY,
      AwsModule.AWS_SECRETS_MANAGER_PARAMETERS_FACTORY,
    ];

    return {
      module: AwsModule,
      imports: [ConfigModule.forRoot({ isGlobal: true }), ServerlessModule],
      providers,
      exports,
    };
  }

  /**
   * Registers a configured AwsModule for import into the app module
   * using at least one dynamic awsModuleAsyncOptions or awsSecretsManagerAsyncOptions
   */
  static forRootAsync({
    awsSsmAsyncOptions,
    awsSecretsManagerAsyncOptions,
  }: AwsModuleAsyncOptions): DynamicModule {
    const providers: DynamicModule['providers'] = [
      this.createAwsSsmOptionsAsyncProviders(awsSsmAsyncOptions),
      this.createAwsSecretsManagerOptionsAsyncProviders(
        awsSecretsManagerAsyncOptions,
      ),
      AwsModule.AWS_SSM_PARAMETERS_FACTORY,
      AwsModule.AWS_SECRETS_MANAGER_PARAMETERS_FACTORY,
      AwsService,
    ];

    const exports: DynamicModule['exports'] = [
      AwsService,
      AwsModule.AWS_SSM_PARAMETERS_FACTORY,
      AwsModule.AWS_SECRETS_MANAGER_PARAMETERS_FACTORY,
    ];

    const imports: DynamicModule['imports'] = [
      ConfigModule.forRoot({ isGlobal: true }),
      ServerlessModule,
      ...(awsSsmAsyncOptions?.imports ?? []),
      ...(awsSecretsManagerAsyncOptions?.imports ?? []),
    ];

    return {
      module: AwsModule,
      imports,
      providers,
      exports,
    };
  }

  private static createAwsSsmOptionsAsyncProviders(
    options: AwsSsmAsyncOptions,
  ): Provider {
    if (options == null) {
      return {
        provide: AWS_SSM_OPTIONS,
        useValue: {},
      };
    } else if (options.useFactory) {
      return {
        provide: AWS_SSM_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    }

    // For useClass and useExisting...
    return {
      provide: AWS_SSM_OPTIONS,
      useFactory: async (optionsFactory: AwsSsmOptionsFactory) =>
        await optionsFactory.createAwsSsmOptions(),
      inject: [options.useExisting ?? options.useClass],
    };
  }

  private static createAwsSecretsManagerOptionsAsyncProviders(
    options: AwsSecretsManagerAsyncOptions,
  ): Provider {
    if (options == null) {
      return {
        provide: AWS_SECRETS_MANAGER_OPTIONS,
        useValue: {},
      };
    } else if (options.useFactory) {
      return {
        provide: AWS_SECRETS_MANAGER_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    }

    // For useClass and useExisting...
    return {
      provide: AWS_SECRETS_MANAGER_OPTIONS,
      useFactory: async (optionsFactory: AwsSecretsManagerOptionsFactory) =>
        await optionsFactory.createAwsSecretsManagerOptions(),
      inject: [options.useExisting ?? options.useClass],
    };
  }
}
