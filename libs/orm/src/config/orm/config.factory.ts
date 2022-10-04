import { ConfigService } from '@nestjs/config';
import { AwsModuleAsyncOptions } from '@app-libs/aws';
import { OrmConfigService } from '@app-libs/orm/config/orm/config.service';

export const configFactory: AwsModuleAsyncOptions = {
  awsSecretsManagerAsyncOptions: {
    useFactory: async (configService: ConfigService) => {
      return {
        parameters: Object.fromEntries(
          Array.from(OrmConfigService.parseConfig(configService).values()).map(
            (secret) => [secret, {}],
          ),
        ),
      };
    },
    inject: [ConfigService],
  },
};
