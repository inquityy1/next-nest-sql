import { Injectable } from '@nestjs/common';
import { Campaign } from './campaign.entity';
import { ValidationException } from '../common/exceptions/validation.exception';
import {
  validateCampaignName,
  validateBudget,
  validateDates,
} from '../common/utils/validation.utils';
import { KafkaService } from '../kafka/kafka.service';
import { RedisService } from '../redis/redis.service';
import { CampaignRepository } from './campaign.repository';

@Injectable()
export class CampaignService {
  constructor(
    private readonly campaignRepository: CampaignRepository,
    private readonly kafkaService: KafkaService,
    private readonly redisService: RedisService,
  ) {}

  async findAll(page: number, limit: number) {
    const cacheKey = `campaigns_page_${page}_limit_${limit}`;
    try {
      const cachedData = await this.redisService.get(cacheKey);
      if (cachedData) {
        return cachedData;
      }
    } catch (error) {
      console.error(`Redis error (findAll): ${error.message}`);
      // Proceed to fetch from DB even if Redis fails
    }

    const [data, total] = await this.campaignRepository.findAndCount(
      page,
      limit,
    );

    const result = { data, total, page, limit };

    try {
      await this.redisService.set(cacheKey, result, 3600); // Cache result
    } catch (error) {
      console.error(`Redis error (set): ${error.message}`);
    }

    return result;
  }

  async create(campaignData: Partial<Campaign>): Promise<Campaign> {
    const { name, budget = 0, startDate, endDate } = campaignData;

    try {
      // Set endDate to startDate if endDate is missing
      const validatedEndDate = endDate || startDate;

      // Validate name
      await validateCampaignName(name, this.campaignRepository);

      // Validate budget
      validateBudget(budget);

      // Validate start and end dates (after assigning endDate if missing)
      validateDates(startDate, validatedEndDate);

      const savedCampaign = await this.campaignRepository.createCampaign({
        name,
        budget,
        startDate,
        endDate: validatedEndDate,
      });

      await this.redisService.delMatching('campaigns_*'); // Invalidate cache
      await this.kafkaService.emit('campaign.created', savedCampaign); // Emit Kafka event

      return savedCampaign;
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error; // Ensure validation errors are thrown as validation exceptions
      }
      throw new Error(`Failed to create campaign: ${error.message}`);
    }
  }

  async update(id: number, campaignData: Partial<Campaign>): Promise<Campaign> {
    try {
      // Find the campaign by id
      const campaign = await this.campaignRepository.findOneById(id);

      if (!campaign) {
        throw new ValidationException('Campaign not found');
      }

      // Extract new values from campaignData
      const { name, budget = 0, startDate, endDate } = campaignData;

      // Validate name
      await validateCampaignName(name, this.campaignRepository, id);

      // Validate budget
      validateBudget(budget);

      // If endDate is not provided, set it to startDate
      const validatedEndDate = endDate || startDate;

      // Validate dates
      validateDates(startDate, validatedEndDate);

      // Update campaign data
      Object.assign(campaign, {
        name,
        budget,
        startDate,
        endDate: validatedEndDate,
      });

      // Save the updated campaign
      const updatedCampaign =
        await this.campaignRepository.updateCampaign(campaign);

      // Invalidate cache
      await this.redisService.delMatching('campaigns_*');

      // Emit Kafka event
      await this.kafkaService.emit('campaign.updated', updatedCampaign);

      return updatedCampaign;
    } catch (error) {
      if (error instanceof ValidationException) {
        throw error;
      }
      throw new Error(`Failed to update campaign: ${error.message}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.campaignRepository.deleteCampaign(id);

      await this.redisService.delMatching('campaigns_*'); // Invalidate cache
      await this.kafkaService.emit('campaign.deleted', { id }); // Emit Kafka event
    } catch (error) {
      throw new Error(`Failed to delete campaign: ${error.message}`);
    }
  }

  async search(name: string): Promise<Campaign[]> {
    try {
      return this.campaignRepository.findByName(name);
    } catch (error) {
      throw new Error(`Failed to search campaigns: ${error.message}`);
    }
  }
}
