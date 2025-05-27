import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from '../user/user.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { getJwtKey } from './jwt-keys.util';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategy/jwt.strategy';

@Module({
  imports: [
    UserModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),

    JwtModule.register({
      privateKey: getJwtKey('private'),
      publicKey: getJwtKey('public'),
      signOptions: {
        algorithm: 'RS256',
        expiresIn: '1d',
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [JwtModule],
})
export class AuthModule {}
