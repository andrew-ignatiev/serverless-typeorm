import { Module } from '@nestjs/common';
import { OrmModule } from '@app-libs/orm';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { ApiEventModule } from './api-events/api-event.module';
import { ServerlessModule } from '@app-libs/sls';
import { connectionFactory } from './typeorm/connection.factory';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OrmModule.forRootAsync(connectionFactory),
    ServerlessModule,
    ApiEventModule,
  ],
  controllers: [AppController],
  providers: [],
})
export class AppModule {}
