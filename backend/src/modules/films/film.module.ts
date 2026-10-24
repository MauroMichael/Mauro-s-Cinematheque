import { Module } from '@nestjs/common';
import { FilmsService } from './film.service';
import { FilmsController } from './film.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Film } from './entities';

@Module({
  controllers: [FilmsController],
  providers: [FilmsService],
  imports: [TypeOrmModule.forFeature([Film])],
  exports: [FilmsService],
})
export class FilmsModule {}
