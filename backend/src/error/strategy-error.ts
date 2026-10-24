import { KindError } from '../enum';
import { SystemError } from './system-error';

export class StrategyError extends SystemError {
  constructor(name: string, key: string) {
    super(`Cant find key [${key}] into strategy [${name}]`);
    this.code = 'system/strategy-not-supported-error';
    this.name = 'StrategyError';
    this.kind = KindError.SYSTEM;
  }
}
