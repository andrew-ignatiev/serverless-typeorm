import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

/**
 * @see: https://docs.nestjs.com/standalone-applications#standalone-applications
 */
export async function createApp() {
  return await NestFactory.createApplicationContext(AppModule);
}
