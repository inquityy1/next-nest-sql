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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiQuery,
  ApiParam,
} from '@nestjs/swagger';
import { CampaignService } from './campaign.service';
import { Campaign } from './campaign.entity';

@ApiTags('Campaigns') // Groups the routes under a "Campaigns" section in Swagger
@Controller('campaigns')
export class CampaignController {
  constructor(private readonly campaignService: CampaignService) {}

  @ApiOperation({ summary: 'Get all campaigns' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Limit of items per page',
    example: 5,
  })
  @ApiResponse({
    status: 200,
    description: 'The list of campaigns',
    type: [Campaign],
  })
  @Get()
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
  ): Promise<{ data: Campaign[]; total: number; page: number; limit: number }> {
    return this.campaignService.findAll(page, limit);
  }

  @ApiOperation({ summary: 'Search campaigns by name' })
  @ApiQuery({
    name: 'name',
    required: true,
    type: String,
    description: 'The name of the campaign to search for',
  })
  @ApiResponse({
    status: 200,
    description: 'The list of matching campaigns',
    type: [Campaign],
  })
  @Get('search')
  async search(@Query('name') name: string): Promise<Campaign[]> {
    return this.campaignService.search(name);
  }

  @ApiOperation({ summary: 'Create a new campaign' })
  @ApiResponse({
    status: 201,
    description: 'The created campaign',
    type: Campaign,
  })
  @Post()
  async create(@Body() campaignData: Campaign): Promise<Campaign> {
    try {
      return this.campaignService.create(campaignData);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  @ApiOperation({ summary: 'Update an existing campaign' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The ID of the campaign to update',
  })
  @ApiResponse({
    status: 200,
    description: 'The updated campaign',
    type: Campaign,
  })
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

  @ApiOperation({ summary: 'Delete a campaign' })
  @ApiParam({
    name: 'id',
    required: true,
    type: Number,
    description: 'The ID of the campaign to delete',
  })
  @ApiResponse({ status: 204, description: 'Successfully deleted' })
  @Delete(':id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.campaignService.delete(id);
  }
}
