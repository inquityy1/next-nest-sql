import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './campaign/campaign.entity';
import { CampaignModule } from './campaign/campaign.module';
import { User } from './auth/auth.entity';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { Chat } from './chat/chat.entity';
import { RedisModule } from './redis/redis.module'; // Import the RedisModule

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes ConfigModule available throughout the app
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [Campaign, User, Chat],
        synchronize: true,
      }),
    }),
    RedisModule, // Add the custom RedisModule here
    CampaignModule,
    AuthModule,
    ChatModule,
  ],
})
export class AppModule {}
