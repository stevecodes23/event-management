import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { ENV } from 'src/constants/env.constant';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { AuthenticationGuard } from 'src/gaurds/authentication.gaurd';
import { RolesGuard } from 'src/gaurds/roles.gaurd';
import { Venue } from '../venue/entities/veneu.entity';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Venue]),
    JwtModule.register({
      secret: ENV.JWT.SECRET,
      signOptions: { expiresIn: ENV.JWT.EXPIRY },
    }),
  ],
  providers: [
    AuthService,
    JwtService,
    NotificationService,
    {
      provide: APP_GUARD,
      useClass: AuthenticationGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
  controllers: [AuthController],
})
export class AuthModule {}
