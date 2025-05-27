import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UserService } from '../user/user.service';
import { UserRole } from 'src/enums/role.enum';
import { JwtPayload } from 'src/interfaces/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password } = registerDto;

    const userExists = await this.userService.findByEmail(email);
    if (userExists) {
      throw new UnauthorizedException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.userService.create({
      ...registerDto,
      password: hashedPassword,
      role: UserRole.USER,
    });

    return user;
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.userService.findByEmail(email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: JwtPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      sub: user.id.toString(),
    };

    // Generate tokens
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_ACCESS_EXPIRATION'),
    });
    const refreshToken = this.jwtService.sign(payload, {
      expiresIn: this.configService.get<string>('JWT_REFRESH_EXPIRATION'),
    });

    return { accessToken, refreshToken };
  }

  logout() {
    return true;
  }
}
