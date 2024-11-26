import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './auth.entity';
import * as bcrypt from 'bcrypt';
import { ValidationException } from '../common/exceptions/validation.exception';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async createUser(username: string, password: string): Promise<User> {
    try {
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
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findUserByUsername(username: string): Promise<User> {
    try {
      return this.userRepository.findOne({ where: { username } });
    } catch (error) {
      throw new Error(`Failed to find user by username: ${error.message}`);
    }
  }

  async validatePassword(
    enteredPassword: string,
    storedPassword: string,
  ): Promise<boolean> {
    try {
      return bcrypt.compare(enteredPassword, storedPassword);
    } catch (error) {
      throw new Error(`Failed to validate password: ${error.message}`);
    }
  }

  async getAllUsers(): Promise<{ id: Number; username: string }[]> {
    try {
      const users = await this.userRepository.find({
        select: ['id', 'username'],
      });
      return users;
    } catch (error) {
      throw new Error(`Failed to get all users: ${error.message}`);
    }
  }
}
