export type EnvironmentType =
  | 'local'
  | 'develop'
  | 'qa'
  | 'beta'
  | 'production';

export interface IServiceAPI {
  API_PORT?: string;
}

export interface IEnvConfig extends IDatabase, IServiceAPI {
  ENVIRONMENT: EnvironmentType;
}

export interface IDatabase {
  DATABASE_URL: string;
  DATABASE_SSL?: string;
}

export interface IEnvironmentDependency {
  ENVIRONMENT: EnvironmentType;
}

export interface IEnvironment {
  setup: (dependencies: IEnvironmentDependency) => Promise<IEnvConfig>;
}
