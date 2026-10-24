import { type KindError } from '../enum';

export class SystemError extends Error {
  code: string;
  kind: KindError;

  constructor(message: string) {
    super(message);
  }
}
