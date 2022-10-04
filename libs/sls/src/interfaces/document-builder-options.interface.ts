import {
  SecuritySchemeObject,
  ServerObject,
} from '@nestjs/swagger/dist/interfaces/open-api-spec.interface';

export interface DocumentBuilderOptions {
  title: string;
  description: string;
  version: string;
  servers?: ServerObject[];
  bearerAuth?: {
    options?: SecuritySchemeObject;
    name?: string;
  };
}
