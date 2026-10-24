import { Injectable, Logger } from '@nestjs/common';
import { CreateUserDto, GetUsersDto, UpdateUserDto } from './dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Brackets, Not, Repository } from 'typeorm';
import { UserAlreadyExistError, UserNotFoundError } from './error';
import { User } from './entities';
import { Status } from './enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    Logger.log('createUserDto', JSON.stringify(createUserDto));

    const exist = await this.userRepository.existsBy({
      email: createUserDto.email,
    });

    if (exist) {
      throw new UserAlreadyExistError(createUserDto.email);
    }

    const user = this.userRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: createUserDto.email,
      phoneNumber: createUserDto.phoneNumber,
    });
    return await this.userRepository.save(user);
  }

  async findAll(getUsersDto: GetUsersDto = {}) {
    const {
      id,
      firstName,
      lastName,
      email,
      status,
      skip,
      take,
      orderBy = 'createdAt',
      orderDirection = 'DESC',
    } = getUsersDto;

    const query = this.userRepository.createQueryBuilder('users');

    if (status) {
      query.andWhere('users.status = :status', {
        status: status as Status,
      });
    } else {
      query.andWhere('users.status != :deleted', {
        deleted: Status.DELETED,
      });
    }

    if (firstName || email || lastName) {
      query.andWhere(
        new Brackets((qb) => {
          if (firstName) {
            qb.orWhere('users.firstName ILIKE :firstName', {
              firstName: `%${firstName}%`,
            });
          }
          if (lastName) {
            qb.orWhere('users.lastName ILIKE :lastName', {
              lastName: `%${lastName}%`,
            });
          }
          if (email) {
            qb.orWhere('users.email ILIKE :email', {
              email: `%${email}%`,
            });
          }
        }),
      );
    }

    if (id) {
      query.andWhere('users.id = :id', { id });
    }

    if (orderBy) {
      query.orderBy(`users.${orderBy}`, orderDirection);
    }

    if (skip) {
      query.skip(skip);
    }
    if (take) {
      query.take(take);
    }

    return await query.getMany();
  }

  async findOne(id: string) {
    const userExist = await this.userRepository.findOne({
      where: { id, status: Not(Status.DELETED) },
    });

    if (userExist === null) {
      throw new UserNotFoundError(id);
    }

    return userExist;
  }

  async findOneByEmail(email: string): Promise<any> {
    const userExist = await this.userRepository.findOne({
      where: { email: email, status: Not(Status.DELETED) },
    });

    if (userExist === null) {
      throw new UserNotFoundError(email);
    }

    return userExist;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const existUser = await this.findOne(id);

    if (updateUserDto.firstName !== undefined) {
      existUser.firstName = updateUserDto.firstName;
    }

    if (updateUserDto.lastName !== undefined) {
      existUser.lastName = updateUserDto.lastName;
    }

    if (updateUserDto.email !== undefined) {
      existUser.email = updateUserDto.email;
    }

    if (updateUserDto.phoneNumber !== undefined) {
      existUser.phoneNumber = updateUserDto.phoneNumber;
    }

    if (updateUserDto.status !== undefined) {
      existUser.status = updateUserDto.status;
    }

    return await this.userRepository.save(existUser);
  }

  async remove(id: string) {
    return await this.userRepository.save({
      id: id,
      status: Status.DELETED,
    });
  }
}
