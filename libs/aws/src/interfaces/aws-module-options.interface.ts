export interface AwsSsmOptions {
  /**
   * Array of SSM parameters to get with default values
   */
  parameters: Record<string, { decryption: boolean; defaultValue?: string }>;
}

export interface AwsSecretsManagerOptions {
  /**
   * Array of Secrets parameters get with default values
   */
  parameters: Record<string, { defaultValue?: string }>;
}

export interface AwsModuleOptions {
  awsSsmOptions?: AwsSsmOptions;
  awsSecretsManagerOptions?: AwsSecretsManagerOptions;
}
