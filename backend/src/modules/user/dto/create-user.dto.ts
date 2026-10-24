import {
  IsEmail,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsEmail()
  email: string;

  @IsString()
  @IsOptional()
  phoneNumber?: string;
}
