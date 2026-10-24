import { SystemError } from '../../../error';
import { KindError } from '../../../enum';

export class FilmAlreadyExistError extends SystemError {
  constructor(attribute: string) {
    super(`Film with this attribute (${attribute}) already exist`);
    this.code = 'film/already-exist';
    this.name = 'FilmAlreadyExistError';
    this.kind = KindError.NOINFO;
  }
}
