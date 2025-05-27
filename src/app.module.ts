import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './module/auth/auth.module';
import { ReviewsModule } from './module/reviews/reviews.module';
import { BooksModule } from './module/books/books.module';
import { UserModule } from './module/user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { dataSourceOptions } from './db/ormconfig';
import { appValidationSchema } from './config/validation';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from './guard/roles.guard';
import { JwtAuthGuard } from './guard/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      validationSchema: appValidationSchema,
      isGlobal: true,
      envFilePath: '.env',
      load: [],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: dataSourceOptions,
      inject: [ConfigService],
    }),
    AuthModule,
    UserModule,
    BooksModule,
    ReviewsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
