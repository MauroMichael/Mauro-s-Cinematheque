import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { EnvironmentService } from '../environment';

@Injectable()
export class DatabaseService implements TypeOrmOptionsFactory {
  constructor(private environmentService: EnvironmentService) {}

  async createTypeOrmOptions(): Promise<TypeOrmModuleOptions> {
    const { DATABASE_URL } = await this.environmentService.getConfig();
    //const isLocal = ENVIRONMENT === 'local';

    return {
      type: 'postgres',
      url: DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      logging: true,
    };
  }
}
