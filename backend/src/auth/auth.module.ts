import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt'; // Added this
import { ConfigModule, ConfigService } from '@nestjs/config'; // Added this
import { AuthController } from './auth.controller';
import { AuthService } from './provider/auth.service';
import { JwtStrategy } from './jwt.strategy';
import { UserModule } from '../user/user.module'; // Adjust this path to match your UserModule file location

@Module({
  imports: [
    UserModule, 
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'fallback_secret_key',
        signOptions: { expiresIn: '1d' }, 
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService], 
})
export class AuthModule {}