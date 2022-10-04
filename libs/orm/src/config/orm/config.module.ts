import { Module } from '@nestjs/common';
import { AwsModule } from '@app-libs/aws';
import { configFactory } from './config.factory';
import { OrmConfigService } from './config.service';

/**
 * Import and provide Orm configuration related classes.
 *
 * @module
 */
@Module({
  imports: [AwsModule.forRootAsync(configFactory)],
  providers: [OrmConfigService],
  exports: [AwsModule, OrmConfigService],
})
export class OrmConfigModule {}
