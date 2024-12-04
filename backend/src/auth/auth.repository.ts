import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './auth.entity';

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findUserByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  async saveUser(user: User): Promise<User> {
    return this.userRepository.save(user);
  }

  async getAllUsers(): Promise<{ id: number; username: string }[]> {
    return this.userRepository.find({
      select: ['id', 'username'],
    });
  }
}
