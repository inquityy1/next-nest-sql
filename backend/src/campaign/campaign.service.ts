import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Campaign } from './campaign.entity';
import { ValidationException } from 'src/common/exceptions/validation.exception';
import {
  validateCampaignName,
  validateBudget,
  validateDates,
} from 'src/common/utils/validation.utils';

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
    const [data, total] = await this.campaignRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
    return { data, total, page, limit };
  }

  async create(campaignData: Partial<Campaign>): Promise<Campaign> {
    const { name, budget = 0, startDate, endDate } = campaignData;

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
  }

  async update(id: number, campaignData: Partial<Campaign>): Promise<Campaign> {
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
  }

  async delete(id: number): Promise<void> {
    await this.campaignRepository.delete(id);
  }

  async search(name: string): Promise<Campaign[]> {
    return this.campaignRepository.find({
      where: { name: Like(`%${name}%`) },
    });
  }
}
