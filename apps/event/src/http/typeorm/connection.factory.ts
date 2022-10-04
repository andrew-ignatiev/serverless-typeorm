import { ORM_DB_HOST } from '../constant';
import { ConfigService } from '@nestjs/config';
import { EventEntity } from '../../common/database';
import {
  ORM_DEFAULT_CONNECTION,
  OrmDatabaseType,
  OrmModuleAsyncOptions,
} from '@app-libs/orm';

export const connectionFactory: OrmModuleAsyncOptions = {
  ormAsyncNodes: [ORM_DEFAULT_CONNECTION],
  ormAsyncOptions: {
    useFactory: async (configService: ConfigService) => {
      return [
        {
          node: ORM_DEFAULT_CONNECTION,
          options: {
            type: OrmDatabaseType.MYSQL,
            host: configService.get(ORM_DB_HOST),
            port: 3306,
            synchronize: false,
            entities: [EventEntity],
          },
        },
      ];
    },
    inject: [ConfigService],
  },
};
