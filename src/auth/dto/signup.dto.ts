import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class signupDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(10)
  password: string;
}
