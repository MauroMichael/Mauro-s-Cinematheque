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
import { FilmsService } from './film.service';
import {
  CreateFilmDto,
  GetFilmsDto,
  UpdateFilmDto,
} from './dto';

@Controller('films')
export class FilmsController {
  constructor(private readonly filmsService: FilmsService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  async create(@Body() createFilmDto: CreateFilmDto) {
    Logger.log('createFilmDto', JSON.stringify(createFilmDto));
    return await this.filmsService.create(createFilmDto);
  }

  @Get('find/all')
  findAll(@Body() getFilmsDto: GetFilmsDto) {
    return this.filmsService.findAll(getFilmsDto);
  }

  @Get(':id/id')
  async findOne(@Param('id') id: string): Promise<any> {
    return await this.filmsService.findOne(id);
  }

  @Put(':id')
  @UsePipes(new ValidationPipe())
  async update(
    @Param('id') id: string,
    @Body() updateFilmDto: UpdateFilmDto,
  ) {
    return await this.filmsService.update(id, updateFilmDto);
  }

  @Delete(':id')
  @UsePipes(new ValidationPipe())
  async remove(@Param('id') id: string) {
    return await this.filmsService.remove(id);
  }
}
