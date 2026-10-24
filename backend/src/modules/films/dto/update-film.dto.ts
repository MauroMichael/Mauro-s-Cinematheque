import { IsEnum, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { Format, Status } from '../enum';

export class UpdateFilmDto {
  @IsString()
  @IsOptional()
  name?: string;

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

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsEnum(Format)
  @IsOptional()
  format?: Format;

  @IsString()
  @IsOptional()
  @IsUrl()
  imageUrl?: string;
}
