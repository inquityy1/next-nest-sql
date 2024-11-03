import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from './campaign/campaign.entity';
import { CampaignModule } from './campaign/campaign.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'qqwwee11',
      database: 'nextandnest',
      entities: [Campaign],
      synchronize: true, // Use this only in development
    }),
    CampaignModule,
  ],
})
export class AppModule {}
