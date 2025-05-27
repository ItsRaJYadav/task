import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class BaseCreateUserDto {
  @IsNotEmpty()
  firstName: string;

  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
