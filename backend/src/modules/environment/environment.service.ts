import { ConfigService } from '@nestjs/config';
import {
  type EnvironmentType,
  type IEnvConfig,
} from './environment.interfaces';
import { Injectable } from '@nestjs/common';
import { EnvironmentStrategy } from './environment.strategy';

@Injectable()
export class EnvironmentService {
  constructor(
    private configService: ConfigService,
    private environmentStrategy: EnvironmentStrategy,
  ) {}

  async getConfig(): Promise<IEnvConfig> {
    const ENVIRONMENT =
      this.configService.get('ENVIRONMENT') ?? ('local' as EnvironmentType);
    return await this.environmentStrategy
      .get(ENVIRONMENT)
      .setup({ ENVIRONMENT });
  }
}
