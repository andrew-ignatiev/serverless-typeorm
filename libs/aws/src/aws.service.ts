import { Inject, Injectable } from '@nestjs/common';
import {
  AWS_REGION,
  AWS_SSM_OPTIONS,
  AWS_SECRETS_MANAGER_OPTIONS,
} from './constants';
import { ConfigService } from '@nestjs/config';
import { ServerlessService } from '@app-libs/sls';
import {
  AwsSecretsManagerOptions,
  AwsSsmOptions,
} from '@app-libs/aws/interfaces';
import * as aws from 'aws-sdk';

@Injectable()
export class AwsService {
  private ssm: aws.SSM;
  private secretsManager: aws.SecretsManager;

  constructor(
    @Inject(AWS_SSM_OPTIONS)
    private awsSsmOptions: AwsSsmOptions,
    @Inject(AWS_SECRETS_MANAGER_OPTIONS)
    private awsSecretsManagerOptions: AwsSecretsManagerOptions,
    private configService: ConfigService,
    private serverlessService: ServerlessService,
  ) {}

  getSsmParametersOptions() {
    return this.awsSsmOptions.parameters ?? null;
  }

  getSecretsManagerParametersOptions() {
    return this.awsSecretsManagerOptions.parameters ?? null;
  }

  /**
   * Returns singleton instance of AWS SSM client
   */
  getSSM() {
    if (this.ssm == null) {
      this.ssm = new aws.SSM({
        region: this.configService.get(AWS_REGION),
        maxRetries: 5,
        retryDelayOptions: {
          base: 100, // default in ms
        },
      });
    }

    return this.ssm;
  }

  /**
   * Returns singleton instance of AWS SecretsManager client
   */
  getSecretsManager() {
    if (this.secretsManager == null) {
      this.secretsManager = new aws.SecretsManager({
        region: this.configService.get(AWS_REGION),
      });
    }

    return this.secretsManager;
  }

  /**
   * Returns parameters values for given SSM options
   */
  async getParametersFromSSM() {
    if (this.getSsmParametersOptions() != null) {
      const parameters = await Promise.all(
        Object.entries(this.getSsmParametersOptions()).map(
          async ([name, { decryption, defaultValue }]) => [
            name,
            await this.getParameterValueFromSMM(name, decryption, defaultValue),
          ],
        ),
      );

      return Object.fromEntries(parameters);
    }

    return {};
  }

  /**
   * Returns parameters values for given Secrets Manager options
   */
  async getParametersFromSecretsManager() {
    if (this.getSecretsManagerParametersOptions() != null) {
      const parameters = await Promise.all(
        Object.entries(this.getSecretsManagerParametersOptions()).map(
          async ([name, { defaultValue }]) => [
            name,
            await this.getParameterValueFromSecretsManager(name, defaultValue),
          ],
        ),
      );

      return Object.fromEntries(parameters);
    }

    return {};
  }

  /**
   * Returns SSM parameter value or defaultValue if parameter doesn't exist
   * @param name
   * @param withDecryption
   * @param defaultValue
   */
  async getParameterValueFromSMM(
    name: string,
    withDecryption: boolean,
    defaultValue?: string,
  ): Promise<string | null> {
    let value;

    if (this.serverlessService.isServerless()) {
      value = (
        await this.getSSM()
          .getParameter({
            Name: name,
            WithDecryption: withDecryption,
          })
          .promise()
      ).Parameter?.Value;
    }

    return value ?? defaultValue ?? null;
  }

  /**
   * Returns Secrets Manager parameter value or defaultValue if parameter doesn't exist
   * @param name
   * @param defaultValue
   */
  async getParameterValueFromSecretsManager<T>(
    name: string,
    defaultValue?: T,
  ): Promise<T | null> {
    let value;

    if (this.serverlessService.isServerless()) {
      value = (
        await this.getSecretsManager()
          .getSecretValue({ SecretId: name })
          .promise()
      ).SecretString;

      if (!!value) {
        value = JSON.parse(value);
      }
    }

    return value ?? defaultValue ?? null;
  }

  /**
   * Puts a parameter to the SSM
   * @see https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/SSM.html#putParameter-property
   */
  async putParameterToSMM(
    param: aws.SSM.PutParameterRequest,
  ): Promise<number | null> {
    let version: number | null = null;

    if (this.serverlessService.isServerless()) {
      version = (await this.getSSM().putParameter(param).promise())?.Version;
    }

    return version ?? null;
  }
}
