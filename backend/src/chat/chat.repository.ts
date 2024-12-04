import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './chat.entity';

@Injectable()
export class ChatRepository {
  constructor(
    @InjectRepository(Chat)
    private readonly repository: Repository<Chat>,
  ) {}

  async saveMessage(
    sender: string,
    receiver: string,
    content: string,
  ): Promise<Chat> {
    const message = this.repository.create({ sender, receiver, content });
    return await this.repository.save(message);
  }

  async getChatHistory(user1: string, user2: string): Promise<Chat[]> {
    const chatHistory = await this.repository.find({
      where: [
        { sender: user1, receiver: user2 },
        { sender: user2, receiver: user1 },
      ],
      order: { createdAt: 'ASC' },
    });

    return chatHistory;
  }
}
