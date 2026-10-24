import { Injectable, Logger } from '@nestjs/common';
import {
  CreateFilmDto,
  GetFilmsDto,
  ResponseGetFilmsDto,
  UpdateFilmDto,
} from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Not, Repository } from 'typeorm';
import { FilmAlreadyExistError, FilmNotFoundError } from './error';
import { Film } from './entities';
import { Format, Status } from './enum';

@Injectable()
export class FilmsService {
  constructor(
    @InjectRepository(Film)
    private filmRepository: Repository<Film>,
  ) {}

  async create(createFilmDto: CreateFilmDto) {
    Logger.log('createFilmDto', JSON.stringify(createFilmDto));

    const exist = await this.existsByBusinessKey(
      createFilmDto.name,
      createFilmDto.sector,
      createFilmDto.code,
    );

    if (exist) {
      throw new FilmAlreadyExistError(createFilmDto.name);
    }

    const film = this.filmRepository.create({
      name: createFilmDto.name,
      country: createFilmDto.country,
      year: createFilmDto.year,
      length: createFilmDto.length,
      genre: createFilmDto.genre,
      sector: createFilmDto.sector,
      code: createFilmDto.code,
      format: createFilmDto.format,
      status: createFilmDto.status,
      imageUrl: createFilmDto.imageUrl,
    });

    return await this.filmRepository.save(film);
  }

  async findAll(getFilmsDto: GetFilmsDto): Promise<ResponseGetFilmsDto> {
    const {
      id,
      name,
      country,
      year,
      genre,
      sector,
      code,
      status,
      format,
      skip,
      take,
      orderBy = 'createdAt',
      orderDirection = 'DESC',
    } = getFilmsDto;

    const query = this.filmRepository.createQueryBuilder('films');

    const total = await query.getCount();

    if (status) {
      query.andWhere('films.status = :status', {
        status: status as Status,
      });
    } else {
      query.andWhere('films.status != :deleted', {
        deleted: Status.DELETED,
      });
    }

    if (name || country || year || genre || sector || code) {
      query.andWhere(
        new Brackets((qb) => {
          if (name) {
            qb.orWhere('films.name ILIKE :name', {
              name: `%${name}%`,
            });
          }

          if (country) {
            qb.orWhere('films.country ILIKE :country', {
              country: `%${country}%`,
            });
          }

          if (year) {
            qb.orWhere('films.year = :year', {
              year,
            });
          }

          if (genre) {
            qb.orWhere('films.genre ILIKE :genre', {
              genre: `%${genre}%`,
            });
          }

          if (sector) {
            qb.orWhere('films.sector ILIKE :sector', {
              sector: `%${sector}%`,
            });
          }
        }),
      );
    }

    if (id) {
      query.andWhere('films.id = :id', { id });
    }

    if (format) {
      query.andWhere('films.format = :format', {
        format: format as Format,
      });
    }

    if (orderBy) {
      query.orderBy(`films.${orderBy}`, orderDirection);
    }

    if (skip) {
      query.skip(skip);
    }

    if (take) {
      query.take(take);
    }

    const totalFiltered = await query.getCount();

    const result = {
      films: await query.getMany(),
      total,
      totalFiltered,
    };

    return result;
  }

  async findOne(id: string) {
    const filmExist = await this.filmRepository.findOne({
      where: { id, status: Not(Status.DELETED) },
    });

    if (filmExist === null) {
      throw new FilmNotFoundError(id);
    }

    return filmExist;
  }

  async update(id: string, updateFilmDto: UpdateFilmDto) {
    const existFilm = await this.findOne(id);

    if (updateFilmDto.name !== undefined) {
      existFilm.name = updateFilmDto.name;
    }

    if (updateFilmDto.country !== undefined) {
      existFilm.country = updateFilmDto.country;
    }

    if (updateFilmDto.year !== undefined) {
      existFilm.year = updateFilmDto.year;
    }

    if (updateFilmDto.length !== undefined) {
      existFilm.length = updateFilmDto.length;
    }

    if (updateFilmDto.genre !== undefined) {
      existFilm.genre = updateFilmDto.genre;
    }

    if (updateFilmDto.sector !== undefined) {
      existFilm.sector = updateFilmDto.sector;
    }

    if (updateFilmDto.code !== undefined) {
      existFilm.code = updateFilmDto.code;
    }

    if (updateFilmDto.status !== undefined) {
      existFilm.status = updateFilmDto.status;
    }

    if (updateFilmDto.format !== undefined) {
      existFilm.format = updateFilmDto.format;
    }

    return await this.filmRepository.save(existFilm);
  }

  async remove(id: string) {
    return await this.filmRepository.save({
      id,
      status: Status.DELETED,
    });
  }

  private async existsByBusinessKey(
    name: string,
    sector?: string,
    code?: number,
  ): Promise<boolean> {
    const query = this.filmRepository
      .createQueryBuilder('films')
      .where('films.name = :name', { name });

    if (sector === undefined) {
      query.andWhere('films.sector IS NULL');
    } else {
      query.andWhere('films.sector = :sector', { sector });
    }

    if (code === undefined) {
      query.andWhere('films.code IS NULL');
    } else {
      query.andWhere('films.code = :code', { code });
    }

    return (await query.getExists()) ?? false;
  }
}
