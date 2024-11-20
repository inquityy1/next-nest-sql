import { Controller, Post, Body, Get } from '@nestjs/common';
import { UserService } from './auth.service';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import * as jwt from 'jsonwebtoken';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UserService) {}

  @Get('users')
  async getAllUsers() {
    return await this.userService.getAllUsers();
  }

  @Post('signup')
  async signup(
    @Body() { username, password }: { username: string; password: string },
  ): Promise<{ message: string; user: { id: number; username: string } }> {
    if (password.length < 6) {
      throw new ValidationException(
        'Password must be at least 6 characters long.',
      );
    }

    if (!username) {
      throw new ValidationException('U need to have an username');
    }

    const user = await this.userService.createUser(username, password);

    return {
      message: 'Account created successfully.',
      user: { id: user.id, username: user.username },
    };
  }

  @Post('login')
  async login(
    @Body() { username, password }: { username: string; password: string },
  ): Promise<{ token: string; username: string }> {
    const user = await this.userService.findUserByUsername(username);
    if (!user) {
      throw new ValidationException('Invalid username or password.');
    }

    const isPasswordValid = await this.userService.validatePassword(
      password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new ValidationException('Invalid username or password.');
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      'SECRET_KEY',
      { expiresIn: '1h' },
    );

    return { token, username: user.username };
  }
}
