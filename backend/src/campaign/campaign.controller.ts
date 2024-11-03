import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { Campaign } from './campaign.entity';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  async findAll(): Promise<Campaign[]> {
    return this.campaignService.findAll();
  }

  @Post()
  async create(@Body() campaignData: Campaign): Promise<Campaign> {
    return this.campaignService.create(campaignData);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() campaignData: Campaign,
  ): Promise<Campaign> {
    return this.campaignService.update(id, campaignData);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.campaignService.delete(id);
  }
}
