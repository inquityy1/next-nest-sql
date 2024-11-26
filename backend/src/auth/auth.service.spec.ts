import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './auth.service';
import { Repository } from 'typeorm';
import { User } from './auth.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';

const mockUserRepository = () => ({
  findOne: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
});

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Partial<Repository<User>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        { provide: getRepositoryToken(User), useValue: mockUserRepository() },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get(getRepositoryToken(User));
  });

  it('should create a new user successfully', async () => {
    userRepository.findOne = jest.fn().mockResolvedValue(null); // No existing user
    userRepository.save = jest.fn().mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: 'hashed',
    });

    const result = await userService.createUser('testuser', 'password123');
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
    expect(userRepository.save).toHaveBeenCalled();
    expect(result).toEqual({ id: 1, username: 'testuser', password: 'hashed' });
  });

  it('should throw an error if username already exists', async () => {
    // Mock the repository method to simulate a user already existing
    userRepository.findOne = jest.fn().mockResolvedValue({
      id: 1,
      username: 'testuser',
      password: 'hashed',
    });

    // Test the service method
    await expect(
      userService.createUser('testuser', 'password123'),
    ).rejects.toThrow('Username already exists.');

    // Ensure the mock was called with the correct conditions
    expect(userRepository.findOne).toHaveBeenCalledWith({
      where: { username: 'testuser' },
    });
  });

  it('should validate the password successfully', async () => {
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    const result = await userService.validatePassword('password123', 'hashed');
    expect(result).toBe(true);
  });

  it('should fetch all users', async () => {
    userRepository.find = jest
      .fn()
      .mockResolvedValue([{ id: 1, username: 'testuser' }]);

    const result = await userService.getAllUsers();
    expect(userRepository.find).toHaveBeenCalledWith({
      select: ['id', 'username'],
    });
    expect(result).toEqual([{ id: 1, username: 'testuser' }]);
  });
});
