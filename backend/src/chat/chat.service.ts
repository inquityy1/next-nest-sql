import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';
import { RedisService } from '../redis/redis.service';
import { ChatRepository } from './chat.repository';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Chat)
    private messageRepository: Repository<Chat>,
    private messageRepositoryR: ChatRepository,
    private redisService: RedisService,
  ) {}

  async saveMessage(
    sender: string,
    receiver: string,
    content: string,
  ): Promise<Chat> {
    try {
      const message = this.messageRepository.create({
        sender,
        receiver,
        content,
      });
      const savedMessage = await this.messageRepository.save(message);

      // Update cache for both directions
      const senderCacheKey = `chat:${sender}:${receiver}`;
      const receiverCacheKey = `chat:${receiver}:${sender}`;

      // Sender's view of the chat
      const senderChatHistory =
        (await this.redisService.get(senderCacheKey)) || [];
      senderChatHistory.push(savedMessage);
      await this.redisService.set(senderCacheKey, senderChatHistory);

      // Receiver's view of the chat
      const receiverChatHistory =
        (await this.redisService.get(receiverCacheKey)) || [];
      receiverChatHistory.push(savedMessage);
      await this.redisService.set(receiverCacheKey, receiverChatHistory);

      return savedMessage;
    } catch (error) {
      throw new Error(`Failed to save messages: ${error.message}`);
    }
  }

  async getChatHistory(user1: string, user2: string): Promise<Chat[]> {
    const cacheKey = `chat:${user1}:${user2}`;
    const cachedChat = await this.redisService.get(cacheKey);

    if (cachedChat) {
      return cachedChat;
    }

    // If no cache, fetch from DB
    try {
      const chatHistory = await this.messageRepository.find({
        where: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
        order: { createdAt: 'ASC' }, // Oldest to newest
      });

      await this.redisService.set(cacheKey, chatHistory); // Cache the result for future use

      return chatHistory;
    } catch (error) {
      throw new Error(`Failed to get chat history: ${error.message}`);
    }
  }

  async createMessage(data: { to: string; from: string; message: string }) {
    try {
      const { to, from, message } = data;
      return await this.saveMessage(from, to, message); // Use saveMessage to persist the data
    } catch (error) {
      throw new Error(`Failed to create message: ${error.message}`);
    }
  }
}
