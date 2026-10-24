import {
  GetSecretValueCommand,
  SecretsManagerClient,
} from '@aws-sdk/client-secrets-manager';
import {
  type IDatabase,
  type IEnvConfig,
  type IEnvironment,
  type IEnvironmentDependency,
} from '../environment.interfaces';
import { EnvironmentError, GetSecretError } from '../error';

type SecretsValuesParameters = IDatabase;

export class EnvironmentRemote implements IEnvironment {
  readonly #env: NodeJS.ProcessEnv = process.env;

  async setup({ ENVIRONMENT }: IEnvironmentDependency): Promise<IEnvConfig> {
    if (ENVIRONMENT === undefined) throw new EnvironmentError('NODE_ENV');

    const AWS_REGION = this.#env.AWS_REGION;
    const AWS_SECRET_NAME = this.#env.AWS_SECRET_NAME;

    if (AWS_REGION === undefined) throw new EnvironmentError('AWS_REGION');
    if (AWS_SECRET_NAME === undefined)
      throw new EnvironmentError('AWS_SECRET_NAME');

    let secretValue: SecretsValuesParameters = {
      DATABASE_URL: '',
    };

    try {
      const client = new SecretsManagerClient({ region: AWS_REGION });
      const command = new GetSecretValueCommand({
        SecretId: AWS_SECRET_NAME,
        VersionStage: 'AWSCURRENT',
      });
      const response = await client.send(command);

      if (response.SecretString !== undefined) {
        secretValue = JSON.parse(response.SecretString);
      }
    } catch (error) {
      throw new GetSecretError();
    }

    if (
      secretValue.DATABASE_URL === undefined ||
      secretValue.DATABASE_URL === ''
    )
      throw new EnvironmentError('DATABASE_URL');

    return {
      ENVIRONMENT,
      ...secretValue,
    };
  }
}
