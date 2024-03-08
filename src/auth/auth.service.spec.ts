import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { AuthService } from './auth.service';
import { User } from './schemas/user.schema';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('authService ', () => {
  let authService: AuthService;
  let model: Model<User>;
  let jwtService: JwtService;

  const ObjectId = Types.ObjectId;

  const mockAuthService = {
    create: jest.fn(),
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getModelToken(User.name),
          useValue: mockAuthService,
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    model = module.get<Model<User>>(getModelToken(User.name));
    jwtService = module.get<JwtService>(JwtService);
  });

  describe('SignUp', () => {
    it('Should signUp and return a token', async () => {
      const hashedPassword = 'passworldHashed';

      const userDto: SignUpDto = {
        name: 'name',
        email: 'email',
        password: hashedPassword,
      };

      const createResponse = {
        _id: new ObjectId('65eb3981f717cf0f14118967'),
        ...userDto,
      };

      const access_token = 'valid_accees_token';

      const hash = jest
        .spyOn(bcrypt, 'hash')
        .mockResolvedValue(hashedPassword as never);

      const createModel = jest
        .spyOn(model, 'create')
        .mockResolvedValue(createResponse as any);

      const token = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue(access_token as never);

      const response = await authService.signUp({
        name: 'name',
        email: 'email',
        password: hashedPassword,
      });

      expect(hash).toHaveBeenCalled();
      expect(createModel).toHaveBeenCalled();
      expect(token).toHaveBeenCalled();

      expect(response).toEqual({ token: access_token });
    });
  });

  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'email',
      password: 'password',
    };
    it('Should login and return a token', async () => {
      const access_token = 'valid_accees_token';

      jest.spyOn(model, 'findOne').mockResolvedValue(true);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);

      const token = jest
        .spyOn(jwtService, 'sign')
        .mockReturnValue(access_token as never);

      const response = await authService.login(loginDto);

      expect(token).toHaveBeenCalled();

      expect(response).toEqual({ token: access_token });
    });

    it("Should return UnauthorizedException('Invalid email or password') if email is incorrect", async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(false);

      await expect(authService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid email or password'),
      );
    });

    it("Should return UnauthorizedException('Invalid email or password') if password is incorrect", async () => {
      jest.spyOn(model, 'findOne').mockResolvedValue(true);
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

      await expect(authService.login(loginDto)).rejects.toThrow(
        new UnauthorizedException('Invalid email or password'),
      );
    });
  });
});
