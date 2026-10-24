import { SystemError } from '../../../error';
import { KindError } from '../../../enum';

export class UserNotFoundError extends SystemError {
  constructor(attribute: string) {
    super(`User with this attribute (${attribute}) not found`);
    this.code = 'user/not-found';
    this.name = 'UserNotFoundError';
    this.kind = KindError.NOINFO;
  }
}
