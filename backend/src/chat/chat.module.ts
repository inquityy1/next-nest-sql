import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChatController } from './chat.controller';
import { ChatGateway } from './chat.gateway';
import { ChatRepository } from './chat.repository';
import { MessagesService } from './chat.service';
import { Chat } from './chat.entity';
import { KafkaModule } from '../kafka/kafka.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Chat]), KafkaModule, RedisModule],
  providers: [ChatGateway, MessagesService, ChatRepository],
  controllers: [ChatController],
})
export class ChatModule {}
