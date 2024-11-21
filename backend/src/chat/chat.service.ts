import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Chat } from './chat.entity';

@Injectable()
export class MessagesService {
  constructor(
    @InjectRepository(Chat)
    private messageRepository: Repository<Chat>,
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
      return await this.messageRepository.save(message);
    } catch (error) {
      throw new Error(`Failed to save messages: ${error.message}`);
    }
  }

  async getChatHistory(user1: string, user2: string): Promise<Chat[]> {
    try {
      return await this.messageRepository.find({
        where: [
          { sender: user1, receiver: user2 },
          { sender: user2, receiver: user1 },
        ],
        order: { createdAt: 'ASC' }, // Oldest to newest
      });
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
