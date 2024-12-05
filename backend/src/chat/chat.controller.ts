import { Controller, Get, UseGuards, Param } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { MessagesService } from './chat.service';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

@ApiTags('Chat') // Groups the routes under a "Chat" section in Swagger
@Controller('chat')
export class ChatController {
  constructor(private messagesService: MessagesService) {}

  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Get chat history between two users' })
  @ApiParam({
    name: 'user1',
    required: true,
    type: String,
    description: 'The first user in the chat history',
  })
  @ApiParam({
    name: 'user2',
    required: true,
    type: String,
    description: 'The second user in the chat history',
  })
  @ApiResponse({
    status: 200,
    description: 'Chat history between the two users',
    type: [String],
  })
  @ApiResponse({ status: 500, description: 'Failed to retrieve chat history' })
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
