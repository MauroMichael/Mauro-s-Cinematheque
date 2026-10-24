import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  Put,
  Logger,
} from '@nestjs/common';
import { UsersService } from './user.service';
import {
  CreateUserDto,
  GetUsersDto,
  UpdateUserDto,
} from './dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createUserDto: CreateUserDto) {
    Logger.log('createUserDto', JSON.stringify(createUserDto));
    return await this.usersService.create(createUserDto);
  }

  @Get('find/all')
  findAll(@Body() getUsersDto: GetUsersDto) {
    return this.usersService.findAll(getUsersDto);
  }

  @Get(':id/id')
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.usersService.findOne(id);
  }

  @Get(':email/email')
  async findOneEmail(@Param('email') email: string): Promise<any> {
    return await this.usersService.findOneByEmail(email);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  async remove(@Param('id') id: string) {
    return await this.usersService.remove(id);
  }
}
