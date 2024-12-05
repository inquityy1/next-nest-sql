import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { Chat } from '../src/chat/chat.entity';
import { ChatRepository } from '../src/chat/chat.repository';
import { TypeOrmModule, getDataSourceToken } from '@nestjs/typeorm';

describe('ChatRepository Integration Tests', () => {
  let repository: ChatRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'qqwwee11',
          database: 'nextandnest',
          entities: [Chat],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Chat]),
      ],
      providers: [ChatRepository],
    }).compile();

    repository = module.get<ChatRepository>(ChatRepository);
    dataSource = module.get<DataSource>(getDataSourceToken());
  });

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  afterEach(async () => {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.query('TRUNCATE TABLE "chat" RESTART IDENTITY CASCADE;');
    await queryRunner.release();
  });

  it('should save and retrieve a chat message', async () => {
    const messageData = {
      sender: 'user1',
      receiver: 'user2',
      content: 'Hello, how are you?',
    };
    const savedMessage = await repository.saveMessage(
      messageData.sender,
      messageData.receiver,
      messageData.content,
    );
    expect(savedMessage).toBeDefined();
    expect(savedMessage.id).toBeDefined();
    expect(savedMessage.sender).toBe(messageData.sender);
    expect(savedMessage.receiver).toBe(messageData.receiver);
    expect(savedMessage.content).toBe(messageData.content);
    expect(savedMessage.createdAt).toBeDefined();
  });

  it('should get chat history between two users', async () => {
    const messageData1 = {
      sender: 'user1',
      receiver: 'user2',
      content: 'Hello, how are you?',
    };
    const messageData2 = {
      sender: 'user2',
      receiver: 'user1',
      content: 'I am good, thanks!',
    };
    await repository.saveMessage(
      messageData1.sender,
      messageData1.receiver,
      messageData1.content,
    );
    await repository.saveMessage(
      messageData2.sender,
      messageData2.receiver,
      messageData2.content,
    );

    const chatHistory = await repository.getChatHistory('user1', 'user2');
    expect(chatHistory.length).toBe(2);
    expect(chatHistory[0].content).toBe(messageData1.content);
    expect(chatHistory[1].content).toBe(messageData2.content);
    expect(chatHistory[0].sender).toBe('user1');
    expect(chatHistory[1].sender).toBe('user2');
    expect(chatHistory[0].receiver).toBe('user2');
    expect(chatHistory[1].receiver).toBe('user1');
    expect(chatHistory[0].createdAt).toBeDefined();
    expect(chatHistory[1].createdAt).toBeDefined();
  });

  it('should retrieve chat messages in the correct order', async () => {
    const messageData1 = {
      sender: 'user1',
      receiver: 'user2',
      content: 'First message.',
    };
    const messageData2 = {
      sender: 'user2',
      receiver: 'user1',
      content: 'Second message.',
    };
    await repository.saveMessage(
      messageData1.sender,
      messageData1.receiver,
      messageData1.content,
    );
    await repository.saveMessage(
      messageData2.sender,
      messageData2.receiver,
      messageData2.content,
    );

    const chatHistory = await repository.getChatHistory('user1', 'user2');
    expect(chatHistory.length).toBe(2);
    expect(chatHistory[0].content).toBe('First message.');
    expect(chatHistory[1].content).toBe('Second message.');
  });

  it('should retrieve an empty chat history when no messages exist', async () => {
    const chatHistory = await repository.getChatHistory('user1', 'user2');
    expect(chatHistory.length).toBe(0);
  });
});
