import { createApp } from './app.factory';
import { AppModule } from './app.module';
import { AppService } from './app.service';

/**
 * @see: https://docs.nestjs.com/standalone-applications#standalone-applications
 */
async function bootstrap(): Promise<void> {
  const nestApp = await createApp();
  await nestApp.select(AppModule).get(AppService, { strict: true }).run();
  await nestApp.close();
}

export function handler() {
  return bootstrap();
}
