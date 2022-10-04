import { INestApplication } from '@nestjs/common';

export interface OpenApiGeneratorOptions {
  createApp: () => Promise<INestApplication>;
}
