import { DataSource } from 'typeorm';
import { User } from '../src/auth/auth.entity';
import { UserRepository } from '../src/auth/auth.repository';

describe('UserRepository Integration Tests', () => {
  let dataSource: DataSource;
  let userRepository: UserRepository;

  beforeAll(async () => {
    try {
      dataSource = new DataSource({
        type: 'postgres',
        host: process.env.POSTGRES_HOST || 'localhost',
        port: Number(process.env.POSTGRES_PORT) || 5432,
        username: process.env.POSTGRES_USER || 'postgres',
        password: process.env.POSTGRES_PASSWORD || 'qqwwee11',
        database: process.env.POSTGRES_DB || 'nextandnest',
        synchronize: true,
        entities: [User],
      });

      await dataSource.initialize();
      userRepository = new UserRepository(dataSource.getRepository(User));
    } catch (error) {
      console.error('Error initializing DataSource:', error);
      throw error;
    }
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should save a new user', async () => {
    const user = new User();
    user.username = 'testuser';
    user.password = 'password123';
    const savedUser = await userRepository.saveUser(user);
    expect(savedUser).toBeDefined();
    expect(savedUser.id).toBeDefined();
    expect(savedUser.username).toBe('testuser');
  });

  it('should find a user by username', async () => {
    const user = await userRepository.findUserByUsername('testuser');
    expect(user).toBeDefined();
    expect(user.username).toBe('testuser');
  });

  it('should get all users with only id and username', async () => {
    const users = await userRepository.getAllUsers();
    expect(users).toBeDefined();
    expect(users.length).toBeGreaterThan(0);
    expect(users[0]).toHaveProperty('id');
    expect(users[0]).toHaveProperty('username');
  });
});
