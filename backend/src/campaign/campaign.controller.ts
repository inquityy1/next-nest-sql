import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  Param,
  Query,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { Campaign } from './campaign.entity';

@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ): Promise<{ data: Campaign[]; total: number; page: number; limit: number }> {
    return this.campaignService.findAll(page, limit);
  }

  @Get('search')
  async search(@Query('name') name: string): Promise<Campaign[]> {
    return this.campaignService.search(name);
  }

  @Post()
  async create(@Body() campaignData: Campaign): Promise<Campaign> {
    try {
      return this.campaignService.create(campaignData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Patch(':id')
  async update(
    @Param('id') id: number,
    @Body() campaignData: Campaign,
  ): Promise<Campaign> {
    try {
      return this.campaignService.update(id, campaignData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.campaignService.delete(id);
  }
}
