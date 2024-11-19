import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './campaign/campaign.entity';
import { CampaignModule } from './campaign/campaign.module';
import { User } from './auth/auth.entity';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'qqwwee11',
      database: 'nextandnest',
      entities: [Campaign, User],
      synchronize: true, // Use this only in development
    }),
    CampaignModule,
    AuthModule,
    ChatModule,
  ],
})
export class AppModule {}
