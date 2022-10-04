import { ORM_DB_HOST } from '../../http/constant';
import { ConfigService } from '@nestjs/config';
import { MIGRATIONS_TABLE } from '../constants';
import { EventTable1647513603754 } from '../migrations';
import {
  ORM_MIGRATION_CONNECTION,
  OrmDatabaseType,
  OrmModuleAsyncOptions,
} from '@app-libs/orm';

export const connectionFactory: OrmModuleAsyncOptions = {
  ormAsyncNodes: [ORM_MIGRATION_CONNECTION],
  ormAsyncOptions: {
    useFactory: async (configService: ConfigService) => {
      return [
        {
          node: ORM_MIGRATION_CONNECTION,
          options: {
            type: OrmDatabaseType.MYSQL,
            host: configService.get(ORM_DB_HOST),
            port: 3306,
            synchronize: false,
            migrations: [EventTable1647513603754],
            migrationsTableName: MIGRATIONS_TABLE,
            migrationsRun: false,
          },
        },
      ];
    },
    inject: [ConfigService],
  },
};
