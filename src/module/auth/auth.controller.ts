import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Response } from 'express';
import { Public } from 'src/decorators/public.decorator';

@Controller('auth')
@Public()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async register(@Body() registerDto: RegisterDto) {
    const user = await this.authService.register(registerDto);
    return { message: 'Registration successful', user };
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { accessToken, refreshToken } =
      await this.authService.login(loginDto);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return { message: 'Login successful', accessToken };
  }

  @Post('logout')
  logout(@Res({ passthrough: true }) res: Response) {
    this.authService.logout();

    res.clearCookie('refreshToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
    });

    return { message: 'Logout successful' };
  }
}
