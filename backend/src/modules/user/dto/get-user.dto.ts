import { IsInt, IsOptional, IsString, Min } from 'class-validator';
import { Status } from '../enum';

export class GetUsersDto {
  @IsString()
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  status?: Status;

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
