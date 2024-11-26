import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Campaign } from './campaign.entity';
import { ValidationException } from '../common/exceptions/validation.exception';
import {
  validateCampaignName,
  validateBudget,
  validateDates,
} from '../common/utils/validation.utils';

@Injectable()
export class CampaignService {
  constructor(
    @InjectRepository(Campaign)
    private readonly campaignRepository: Repository<Campaign>,
  ) {}

  async findAll(
    page: number,
    limit: number,
  ): Promise<{ data: Campaign[]; total: number; page: number; limit: number }> {
    try {
      const [data, total] = await this.campaignRepository.findAndCount({
        skip: (page - 1) * limit,
        take: limit,
      });
      return { data, total, page, limit };
    } catch (error) {
      throw new Error(`Failed to fetch campaigns: ${error.message}`);
    }
  }

  async create(campaignData: Partial<Campaign>): Promise<Campaign> {
    const { name, budget = 0, startDate, endDate } = campaignData;

    try {
      // Validate name
      await validateCampaignName(name, this.campaignRepository);

      // Validate budget
      validateBudget(budget);

      // Validate start and end dates
      validateDates(startDate, endDate);

      const campaign = this.campaignRepository.create({
        ...campaignData,
        startDate: new Date(startDate).toISOString(),
        endDate: endDate
          ? new Date(endDate).toISOString()
          : new Date(startDate).toISOString(),
        budget,
      });

      console.log(startDate, endDate);

      return this.campaignRepository.save(campaign);
    } catch (error) {
      throw new Error(`Failed to create campaign: ${error.message}`);
    }
  }

  async update(id: number, campaignData: Partial<Campaign>): Promise<Campaign> {
    try {
      const campaign = await this.campaignRepository.findOne({ where: { id } });
      const { name, budget = 0, startDate, endDate } = campaignData;

      if (!campaign) {
        throw new ValidationException('Campaign not found');
      }

      // Validate name
      await validateCampaignName(name, this.campaignRepository, id);

      // Validate budget
      validateBudget(budget);

      // Validate start and end dates
      validateDates(startDate, endDate);

      Object.assign(campaign, campaignData);
      return this.campaignRepository.save(campaign);
    } catch (error) {
      throw new Error(`Failed to update campaign: ${error.message}`);
    }
  }

  async delete(id: number): Promise<void> {
    try {
      await this.campaignRepository.delete(id);
    } catch (error) {
      throw new Error(`Failed to delete campaign: ${error.message}`);
    }
  }

  async search(name: string): Promise<Campaign[]> {
    try {
      return this.campaignRepository.find({
        where: { name: Like(`%${name}%`) },
      });
    } catch (error) {
      throw new Error(`Failed to search campaigns: ${error.message}`);
    }
  }
}
