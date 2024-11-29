import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './campaign.entity';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { KafkaModule } from '../kafka/kafka.module';
import { RedisModule } from '../redis/redis.module';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign]), KafkaModule, RedisModule],
  controllers: [CampaignController],
  providers: [CampaignService],
})
export class CampaignModule {}
