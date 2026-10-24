import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Status } from '../enum';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsEmail()
  @IsOptional()
  email?: string;

  @IsEmail()
  @IsOptional()
  phoneNumber?: string;

  @IsEnum(Status)
  @IsOptional()
  status?: Status;
}
