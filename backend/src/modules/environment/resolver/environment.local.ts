import {
  IServiceAPI,
  type IDatabase,
  type IEnvConfig,
  type IEnvironment,
  type IEnvironmentDependency,
} from '../environment.interfaces';
import { EnvironmentError } from '../error';

export class EnvironmentLocal implements IEnvironment {
  readonly #env: NodeJS.ProcessEnv = process.env;

  async setup({ ENVIRONMENT }: IEnvironmentDependency): Promise<IEnvConfig> {
    if (ENVIRONMENT === undefined) throw new EnvironmentError('NODE_ENV');

    const serviceApi: IServiceAPI = {
      API_PORT: '',
    };

    serviceApi.API_PORT = this.#env.API_PORT ?? '';
    if (serviceApi.API_PORT === '') throw new EnvironmentError('API_PORT');

    const serviceDatabase: IDatabase = {
      DATABASE_URL: '',
    };

    serviceDatabase.DATABASE_URL = this.#env.DATABASE_URL ?? '';
    if (serviceDatabase.DATABASE_URL === '')
      throw new EnvironmentError('DATABASE_URL');

    serviceDatabase.DATABASE_SSL = this.#env.DATABASE_SSL;

    return {
      ENVIRONMENT,
      ...serviceApi,
      ...serviceDatabase,
    };
  }
}
