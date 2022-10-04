import { AppService } from './migration/app.service';
import { AppModule as MigrationModule } from './migration/app.module';

enum Type {
  HTTP,
  MIGRATIONS,
}

async function bootstrap(type: Type) {
  if (type === Type.HTTP) {
    const app = await (await import('./http/app.factory')).createApp();
    await app.listen(3001);
  } else if (type === Type.MIGRATIONS) {
    const app = await (await import('./migration/app.factory')).createApp();
    await app.select(MigrationModule).get(AppService, { strict: true }).run();
    await app.close();
  }
}

(async () => await bootstrap(Type.HTTP))();
