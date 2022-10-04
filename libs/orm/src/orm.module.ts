import { DynamicModule, Global, Module, Provider } from '@nestjs/common';
import { OrmConfigModule } from '@app-libs/orm/config/orm/config.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import {
  OrmAsyncOptions,
  OrmModuleAsyncOptions,
  OrmOptionsFactory,
} from '@app-libs/orm/interfaces';
import { ORM_OPTIONS } from '@app-libs/orm/constants';
import { OrmService } from '@app-libs/orm/orm.service';

@Global()
@Module({})
export class OrmModule {
  static ORM_CONFIG_FACTORY = (node: string) => ({
    useFactory: (config: OrmService) => {
      return config.getTypeOrmConfiguration(node);
    },
    inject: [OrmService],
  });

  /**
   * Registers OrmModule with a configured TypeOrmModule for import into the app
   * module using dynamic ormAsyncOptions
   * @see: https://docs.nestjs.com/techniques/database#multiple-databases
   */
  static forRootAsync({
    ormAsyncNodes,
    ormAsyncOptions,
  }: OrmModuleAsyncOptions): DynamicModule {
    const providers: DynamicModule['providers'] = [
      this.createOrmOptionsAsyncProviders(ormAsyncOptions),
      OrmService,
    ];

    const exports: DynamicModule['exports'] = [OrmService, TypeOrmModule];
    const imports: DynamicModule['imports'] = [
      ConfigModule.forRoot({ isGlobal: true }),
      OrmConfigModule,
      ...(ormAsyncOptions.imports ?? []),
      ...ormAsyncNodes.map((node) =>
        TypeOrmModule.forRootAsync(OrmModule.ORM_CONFIG_FACTORY(node)),
      ),
    ];

    return {
      module: OrmModule,
      imports,
      providers,
      exports,
    };
  }

  private static createOrmOptionsAsyncProviders(
    options: OrmAsyncOptions,
  ): Provider {
    if (options.useFactory) {
      return {
        provide: ORM_OPTIONS,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    }

    // For useClass and useExisting...
    return {
      provide: ORM_OPTIONS,
      useFactory: async (optionsFactory: OrmOptionsFactory) =>
        await optionsFactory.createOrmOptions(),
      inject: [options.useExisting ?? options.useClass],
    };
  }
}
