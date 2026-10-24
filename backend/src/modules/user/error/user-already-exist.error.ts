import { SystemError } from '../../../error';
import { KindError } from '../../../enum';

export class UserAlreadyExistError extends SystemError {
  constructor(attribute: string) {
    super(`User with this attribute (${attribute}) already exist`);
    this.code = 'user/already-exist';
    this.name = 'UserAlreadyExistError';
    this.kind = KindError.NOINFO;
  }
}
