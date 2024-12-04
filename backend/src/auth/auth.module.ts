import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './auth.entity';
import { UserService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserRepository } from './auth.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserService, UserRepository],
  controllers: [AuthController],
})
export class AuthModule {}
