import { Injectable } from '@nestjs/common';
import { UserRepository } from './auth.repository';
import { User } from './auth.entity';
import * as bcrypt from 'bcryptjs';
import { ValidationException } from '../common/exceptions/validation.exception';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async createUser(username: string, password: string): Promise<User> {
    const existingUser = await this.userRepository.findUserByUsername(username);
    try {
      if (existingUser) {
        throw new ValidationException('Username already exists.');
      }

      const user = new User();
      user.username = username;
      user.password = password;

      return this.userRepository.saveUser(user);
    } catch (error) {
      // Preserve the original exception type
      if (existingUser) {
        throw new ValidationException('Username already exists.');
      }

      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  async findUserByUsername(username: string): Promise<User> {
    try {
      return this.userRepository.findUserByUsername(username);
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
      return this.userRepository.getAllUsers();
    } catch (error) {
      throw new Error(`Failed to get all users: ${error.message}`);
    }
  }
}
