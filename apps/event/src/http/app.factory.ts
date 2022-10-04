import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {
  ServerlessModule,
  ServerlessService,
  DocumentBuilderOptions,
} from '@app-libs/sls';
import { VersioningType } from '@nestjs/common';

export async function createApp() {
  const app = await NestFactory.create(AppModule);
  const sls = app.select(ServerlessModule).get(ServerlessService);
  const cfg = {
    title: 'Events API',
    description: 'API to query events',
    version: '1.0.0',
    servers: sls.getOpenApiServers(),
  } as DocumentBuilderOptions;

  const appPath = '/domain/subdomain';
  const docPath = `${appPath}/docs/`;
  const oasPath = appPath.replace(sls.getOpenApiBasePath(), '');

  app.setGlobalPrefix(oasPath).enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1.0.0',
  });

  return sls
    .enableAppCors(app)
    .createAppDocument(app, docPath, cfg)
    .setGlobalPrefix(appPath);
}
