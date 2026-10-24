import { SystemError } from '../../../error';
import { KindError } from '../../../enum';

export class FilmNotFoundError extends SystemError {
  constructor(attribute: string) {
    super(`Film with this attribute (${attribute}) not found`);
    this.code = 'film/not-found';
    this.name = 'FilmNotFoundError';
    this.kind = KindError.NOINFO;
  }
}
