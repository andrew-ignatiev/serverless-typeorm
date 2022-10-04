import { tmpdir } from 'os';
import { format } from 'util';
import { writeFileSync, readFileSync } from 'fs';
import { INestApplication, Injectable, Logger } from '@nestjs/common';
import { DocumentBuilder, OpenAPIObject, SwaggerModule } from '@nestjs/swagger';
import {
  DocumentBuilderOptions,
  OpenApiGeneratorOptions,
} from '@app-libs/sls/interfaces';
import { ConfigService } from '@nestjs/config';
import { ServerlessStageEnum } from './enums';
import {
  ENV_CORS_DOMAINS,
  ENV_OPEN_API_SAVE_FILE,
  ENV_OPEN_API_SERVERS,
  ENV_SLS_STAGE,
} from '@app-libs/sls/constants';
import * as swaggerUi from 'swagger-ui-express';
import { ErrorWithCause } from 'pony-cause';

@Injectable()
export class ServerlessService {
  static readonly ERROR_OPEN_API_GENERATION = `OpenApi generation failed`;
  static readonly LOG_OPEN_API_GENERATION_START = `OpenApi generation has been started`;
  static readonly LOG_OPEN_API_GENERATION_COMPLETE = `OpenApi generation has been completed`;
  static readonly OPEN_API_FILE_PATH = '%s/swagger.json';

  private readonly logger = new Logger(ServerlessService.name);

  constructor(private configService: ConfigService) {}

  isServerless() {
    return this.getStage() != null;
  }

  isSaveOpenApiFile() {
    return parseInt(this.configService.get(ENV_OPEN_API_SAVE_FILE), 10) === 1;
  }

  isServeOpenApiUI() {
    return this.getStage() !== ServerlessStageEnum.PROD;
  }

  getOpenApiFilePath() {
    return format(ServerlessService.OPEN_API_FILE_PATH, tmpdir());
  }

  saveOpenApiFile(doc: OpenAPIObject) {
    return writeFileSync(this.getOpenApiFilePath(), JSON.stringify(doc), {
      encoding: 'utf-8',
    });
  }

  readOpenApiFile() {
    return readFileSync(this.getOpenApiFilePath(), {
      encoding: 'utf-8',
    });
  }

  getStage() {
    const stage = this.configService.get(ENV_SLS_STAGE);
    return Object.values(ServerlessStageEnum).includes(stage) ? stage : null;
  }

  getCorsDomains(): Array<string> {
    return (
      this.configService.get(ENV_CORS_DOMAINS)?.toString().split(',') ?? []
    );
  }

  getOpenApiServers(): DocumentBuilderOptions['servers'] {
    return (
      this.configService.get(ENV_OPEN_API_SERVERS)?.toString().split(',') ?? []
    ).map((url) => ({ url }));
  }

  getOpenApiBasePath() {
    return (
      this.getOpenApiServers()
        .map(({ url }) => new URL(url).pathname)
        .find((path) => path != '/') ?? ''
    );
  }

  getCorsOrigin(
    origin: string,
    callback: (err: Error | null, origin?: boolean) => void,
  ) {
    callback(null, this.getCorsDomains().includes(origin));
  }

  enableAppCors(app: INestApplication) {
    app.enableCors({
      origin: this.getCorsOrigin.bind(this),
      credentials: true,
      optionsSuccessStatus: 200, // default serverless behaviour
    });

    return this;
  }

  createAppDocument(
    app: INestApplication,
    docPath: string,
    options: DocumentBuilder,
  ): INestApplication;
  createAppDocument(
    app: INestApplication,
    docPath: string,
    options: DocumentBuilderOptions,
  ): INestApplication;
  createAppDocument(
    app: INestApplication,
    docPath: string,
    options: any,
  ): INestApplication {
    if (!this.isServeOpenApiUI() && !this.isSaveOpenApiFile()) {
      return app;
    }

    let config: ReturnType<InstanceType<typeof DocumentBuilder>['build']>;

    if (options instanceof DocumentBuilder) {
      config = options.build();
    } else {
      const builder = new DocumentBuilder()
        .setTitle(options.title)
        .setDescription(options.description)
        .setVersion(options.version);

      options.servers?.forEach((server) =>
        builder.addServer(server.url, server.description),
      );

      if (options.bearerAuth != null) {
        builder.addBearerAuth(
          options.bearerAuth.options,
          options.bearerAuth.name,
        );
      }

      config = builder.build();
    }

    const doc = SwaggerModule.createDocument(app, config);

    if (this.isServeOpenApiUI()) {
      app
        .getHttpAdapter()
        .getInstance()
        .use(
          docPath,
          swaggerUi.serveWithOptions({ redirect: false }),
          swaggerUi.setup(doc),
        );
    }

    if (this.isSaveOpenApiFile()) {
      this.saveOpenApiFile(doc);
    }

    return app;
  }

  /**
   * Generates and returns OpenAPI file
   */
  async generateOpenApiFile({ createApp }: OpenApiGeneratorOptions) {
    this.logger.log(ServerlessService.LOG_OPEN_API_GENERATION_START);

    let oas = null;

    try {
      await (await createApp()).close();
      oas = this.readOpenApiFile();

      if (oas) {
        oas = JSON.parse(oas);
      }
    } catch (e) {
      throw new ErrorWithCause(ServerlessService.ERROR_OPEN_API_GENERATION, {
        cause: e,
      });
    }

    if (!oas) {
      throw new Error(ServerlessService.ERROR_OPEN_API_GENERATION);
    }

    this.logger.log(ServerlessService.LOG_OPEN_API_GENERATION_COMPLETE);

    return oas;
  }
}
