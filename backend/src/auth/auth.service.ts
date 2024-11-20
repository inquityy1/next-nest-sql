import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './auth.entity';
import * as bcrypt from 'bcrypt';
import { ValidationException } from 'src/common/exceptions/validation.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findOne({
      where: { username },
    });
    if (existingUser) {
      throw new ValidationException('Username already exists.');
    }

    const user = new User();
    user.username = username;
    user.password = password; // Hashing will happen automatically before insert

    return this.userRepository.save(user);
  }

  async findUserByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async validatePassword(
    enteredPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    return bcrypt.compare(enteredPassword, storedPassword);
  }

  async getAllUsers(): Promise<{ id: Number; username: string }[]> {
    const users = await this.userRepository.find({
      select: ['id', 'username'],
    });
    return users;
  }
}
