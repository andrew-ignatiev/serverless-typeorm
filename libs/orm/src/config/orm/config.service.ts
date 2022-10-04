import { ConfigService } from '@nestjs/config';
import { Inject, Injectable } from '@nestjs/common';
import { isPlainObject, tryParseJSON } from '@app-libs/api';
import { AWS_SECRETS_MANAGER_PARAMETERS } from '@app-libs/aws';
import { SECRET_ORM, ORM_DEFAULT_CONNECTION } from '@app-libs/orm/constants';

/**
 * Service dealing with ORM configuration.
 *
 * @class
 */
@Injectable()
export class OrmConfigService {
  static readonly config: Map<string, string> = new Map();

  constructor(
    @Inject(AWS_SECRETS_MANAGER_PARAMETERS)
    private readonly secretsValues: Record<string, Record<string, string>>,
  ) {}

  /**
   * Parses environment variable which can be one of:
   * - secret parameter name assigned to default node
   * - json encoded Map<string, string> where key is node and
   *   value is corresponding secret parameter name
   */
  static parseConfig(configService: ConfigService) {
    OrmConfigService.config.clear();

    const config = tryParseJSON(configService.get(SECRET_ORM));
    if (!!config && !Array.isArray(config)) {
      Object.entries(
        isPlainObject(config) ? config : { [ORM_DEFAULT_CONNECTION]: config },
      ).forEach(
        ([key, value]) =>
          value?.toString() &&
          OrmConfigService.config.set(key, value.toString()),
      );
    }

    return OrmConfigService.config;
  }

  /**
   * Returns database value from secret for given node
   */
  getDatabase(node: string) {
    return this.getSecretValue(node)?.database ?? '';
  }

  /**
   * Returns host value from secret for given node
   */
  getHost(node: string) {
    return this.getSecretValue(node)?.host ?? '';
  }

  /**
   * Returns username value from secret for given node
   */
  getUsername(node: string) {
    return this.getSecretValue(node)?.username ?? '';
  }

  /**
   * Returns password value from secret for given node
   */
  getPassword(node: string) {
    return this.getSecretValue(node)?.password ?? '';
  }

  /**
   * Returns secret values for given node
   */
  private getSecretValue(node: string) {
    return this.secretsValues[OrmConfigService.config.get(node)];
  }
}
