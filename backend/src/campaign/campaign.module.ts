import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './campaign.entity';
import { CampaignService } from './campaign.service';
import { CampaignController } from './campaign.controller';
import { KafkaModule } from '../kafka/kafka.module';
import { RedisModule } from '../redis/redis.module';
import { CampaignRepository } from './campaign.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign]), RedisModule, KafkaModule],
  controllers: [CampaignController],
  providers: [CampaignService, CampaignRepository, RedisModule, KafkaModule],
})
export class CampaignModule {}
