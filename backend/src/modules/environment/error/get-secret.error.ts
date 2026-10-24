import { SystemError } from '../../../error';
import { KindError } from '../../../enum';

export class GetSecretError extends SystemError {
  constructor() {
    super('Cant get secrets [AWS]');
    this.code = 'connection/get-secret-error';
    this.name = 'GetSecretError';
    this.kind = KindError.SYSTEM;
  }
}
