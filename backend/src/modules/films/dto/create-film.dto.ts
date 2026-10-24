import { IsEnum, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Format, Status } from '../enum';

export class CreateFilmDto {
  @IsString()
  name: string;

  @IsNumber()
  @IsOptional()
  year?: number;

  @IsNumber()
  @IsOptional()
  length?: number;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  genre?: string;

  @IsString()
  @IsOptional()
  sector?: string;

  @IsNumber()
  @IsOptional()
  code?: number;

  @IsEnum(Format)
  format: Format;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
