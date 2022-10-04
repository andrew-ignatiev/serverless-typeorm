import { Module, Global } from '@nestjs/common';
import { ServerlessService } from './serverless.service';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Global()
@Module({
  imports: [ConfigModule.forRoot()],
  providers: [ServerlessService, ConfigService],
  exports: [ServerlessService],
})
export class ServerlessModule {}
