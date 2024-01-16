import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class loginDto {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  password: string;
}
