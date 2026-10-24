import { EnvironmentType, IEnvironment } from './environment.interfaces';
import { EnvironmentLocal, EnvironmentRemote } from './resolver';
import { Injectable } from '@nestjs/common';
import { StrategyError } from '../../error';

@Injectable()
export class EnvironmentStrategy {
  readonly #strategy: Map<EnvironmentType, IEnvironment>;

  constructor() {
    this.#strategy = new Map();
    this.#strategy.set('local', new EnvironmentLocal());
    this.#strategy.set('develop', new EnvironmentRemote());
    this.#strategy.set('qa', new EnvironmentRemote());
    this.#strategy.set('beta', new EnvironmentRemote());
    this.#strategy.set('production', new EnvironmentRemote());
  }

  get(environment: EnvironmentType): IEnvironment {
    const strategy = this.#strategy.get(environment);
    if (strategy === undefined)
      throw new StrategyError('EnvironmentStrategy', environment);
    return strategy;
  }
}
