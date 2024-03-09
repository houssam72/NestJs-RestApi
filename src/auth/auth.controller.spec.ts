import { Test } from '@nestjs/testing';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { SignUpDto } from './dto/signup.dto';
import { LoginDto } from './dto/login.dto';

describe('bookController', () => {
  let authController: AuthController;
  let authService: AuthService;

  const token = { token: 'valid_access_token' };

  const mockAuthService = {
    signUp: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [PassportModule.register({ defaultStrategy: 'jwt' })],
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authService = moduleRef.get<AuthService>(AuthService);
    authController = moduleRef.get<AuthController>(AuthController);
  });

  describe('signUp', () => {
    const userDto: SignUpDto = {
      name: 'name',
      email: 'email',
      password: 'hashedPassword',
    };

    it('should signup', async () => {
      const signUpService = jest
        .spyOn(authService, 'signUp')
        .mockResolvedValue(token);

      const response = await authController.signUp(userDto);

      expect(signUpService).toHaveBeenCalled();
      expect(response).toEqual(token);
    });
  });
  describe('login', () => {
    const loginDto: LoginDto = {
      email: 'email',
      password: 'password',
    };
    it('should login', async () => {
      const loginService = jest
        .spyOn(authService, 'login')
        .mockResolvedValue(token);

      const response = await authController.login(loginDto);

      expect(loginService).toHaveBeenCalled();
      expect(response).toEqual(token);
    });
  });
});
