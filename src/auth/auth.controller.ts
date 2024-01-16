import { Body, Controller, Get, Post } from '@nestjs/common';
import { signupDto } from './dto/signup.dto';
import { AuthService } from './auth.service';
import { loginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('/login')
  login(@Body() userLogin: loginDto) {
    return this.authService.login(userLogin);
  }

  @Post('/signup')
  signUp(@Body() userSigUp: signupDto) {
    return this.authService.signUp(userSigUp);
  }
}
