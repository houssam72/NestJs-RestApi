import { ForbiddenException, Injectable } from '@nestjs/common';
import { signupDto } from './dto/signup.dto';
import { User } from './Schema/user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { loginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,

    private jwtService: JwtService,
  ) {}

  async login(userDto: loginDto) {
    const { email, password } = userDto;

    return await this.userModel
      .findOne({ email })
      .then(async (response) => {
        const isMatch = await bcrypt.compare(password, response.password);
        if (isMatch) {
          return {
            access_token: this.jwtService.sign({
              _id: response._id,
              userName: response.name,
            }),
          };
        }
        throw new ForbiddenException('Email or password not Match');
      })
      .catch((err) => {
        throw new ForbiddenException(err);
      });
  }

  async signUp(userDto: signupDto) {
    const { name, email, password } = userDto;

    const hash = await bcrypt.hash(password, 10);
    return await this.userModel
      .create({
        name,
        email,
        password: hash,
      })
      .then((response) => {
        return {
          access_token: this.jwtService.sign({
            _id: response._id,
            userName: response.name,
          }),
        };
      })
      .catch((err) => {
        throw new ForbiddenException(err);
      });
  }
}
