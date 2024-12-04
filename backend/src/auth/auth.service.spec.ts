import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './auth.service';
import { UserRepository } from './auth.repository';
import { User } from './auth.entity';
import * as bcrypt from 'bcryptjs';
import { ValidationException } from '../common/exceptions/validation.exception';

const mockUserRepository = () => ({
  findUserByUsername: jest.fn(),
  saveUser: jest.fn(),
  getAllUsers: jest.fn(),
});

describe('UserService', () => {
  let userService: UserService;
  let userRepository: jest.Mocked<UserRepository>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: UserRepository, useValue: mockUserRepository() },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(UserRepository);
  });

  it('should create a new user successfully', async () => {
    userRepository.findUserByUsername.mockResolvedValue(null); // No existing user
    userRepository.saveUser.mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: 'hashed',
    } as User);

    const result = await userService.createUser('testuser', 'password123');
    expect(userRepository.findUserByUsername).toHaveBeenCalledWith('testuser');
    expect(userRepository.saveUser).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, username: 'testuser', password: 'hashed' });
  });

  it('should throw an error if username already exists', async () => {
    userRepository.findUserByUsername.mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: 'hashed',
      hashPassword: jest.fn(),
    });

    await expect(
      userService.createUser('testuser', 'password123'),
    ).rejects.toThrow(ValidationException);

    expect(userRepository.findUserByUsername).toHaveBeenCalledWith('testuser');
  });

  it('should validate the password successfully', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await userService.validatePassword('password123', 'hashed');
    expect(result).toBe(true);
  });

  it('should fetch all users', async () => {
    userRepository.getAllUsers.mockResolvedValue([
      { id: 1, username: 'testuser' },
    ]);

    const result = await userService.getAllUsers();
    expect(userRepository.getAllUsers).toHaveBeenCalled();
    expect(result).toEqual([{ id: 1, username: 'testuser' }]);
  });
});
