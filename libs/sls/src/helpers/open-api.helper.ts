import { NestFactory } from '@nestjs/core';
import {
  OpenApiGeneratorOptions,
  ServerlessModule,
  ServerlessService,
} from '@app-libs/sls';

/**
 * @see: https://docs.nestjs.com/standalone-applications#standalone-applications
 */
export async function openApi({ createApp }: OpenApiGeneratorOptions) {
  const nestApp = await NestFactory.createApplicationContext(ServerlessModule);
  const openApi = await nestApp
    .select(ServerlessModule)
    .get(ServerlessService, { strict: true })
    .generateOpenApiFile({ createApp });

  await nestApp.close();

  return openApi;
}
