import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppService } from './app.service';
import { OrmModule } from '@app-libs/orm';
import { connectionFactory } from './typeorm/connection.factory';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    OrmModule.forRootAsync(connectionFactory),
  ],
  providers: [AppService],
  exports: [AppService],
})
export class AppModule {}
