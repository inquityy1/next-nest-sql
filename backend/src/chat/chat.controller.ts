import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessagesService } from './chat.service';

@Controller('chat')
export class ChatController {
  constructor(private messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @Get('history/:user1/:user2')
  async getChatHistory(
    @Param('user1') user1: string,
    @Param('user2') user2: string,
  ) {
    try {
      return await this.messagesService.getChatHistory(user1, user2);
    } catch (error) {
      throw new Error(`Failed to get chat history: ${error.message}`);
    }
  }
}
