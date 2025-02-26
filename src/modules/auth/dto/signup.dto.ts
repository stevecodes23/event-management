import {
  ValidationOptions,
  IsNotEmpty,
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class SignUpDto {
  @IsString()
  @IsNotEmpty({ message: 'Name should not be empty' } as ValidationOptions)
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEmail()
  email: string;

  // @IsOptional()
  // @IsEnum(UserRole)
  // type: UserRole;
}
