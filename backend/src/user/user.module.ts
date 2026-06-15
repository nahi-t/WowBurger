import { User } from './user.entity';
import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './provider/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService] // 👈 ADD THIS LINE
})
export class UserModule {}