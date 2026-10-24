import {
  IsEnum,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Min,
} from 'class-validator';
import { Format, Status } from '../enum';

export class ResponseGetFilmsDto {
  films: GetFilmsDto[];

  @IsNumber()
  total: number;

  @IsNumber()
  totalFiltered: number;
}

export class GetFilmsDto {
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

  @IsString()
  @IsOptional()
  id?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;

  @IsEnum(Format)
  @IsOptional()
  format?: Format;

  @IsInt()
  @Min(0)
  @IsOptional()
  skip?: number;

  @IsInt()
  @Min(1)
  @IsOptional()
  take?: number;

  @IsString()
  @IsOptional()
  orderBy?: string;

  @IsString()
  @IsOptional()
  orderDirection?: 'ASC' | 'DESC';
}
