import { Controller, Get, UseGuards, Req } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('chat')
export class ChatController {
  @UseGuards(JwtAuthGuard)
  @Get()
  async getChat(@Req() req) {
    const user = req.user;
    return {
      message: `Welcome to the chat, ${user.username}!`,
      user,
    };
  }
}
