import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Campaign } from './campaign.entity';
import { ValidationException } from 'src/common/exceptions/validation.exception';

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
    console.log('service', page, limit, total, data);
    return { data, total, page, limit };
  }

  async create(campaignData: Partial<Campaign>): Promise<Campaign> {
    // Check if no name
    if (!campaignData.name) {
      throw new ValidationException('Campaign name is required');
    }

    // Check if name is unique
    const existingCampaign = await this.campaignRepository.findOne({
      where: { name: campaignData.name },
    });
    if (existingCampaign) {
      throw new ValidationException('Campaign name must be unique.');
    }

    // Set price to be 0 as a default if not provided
    const budget = campaignData.budget ?? 0;

    // Ensure price is a positive integer
    if (budget < 0 || !Number.isInteger(budget)) {
      throw new ValidationException(
        'Price must be a positive number without decimals.',
      );
    }

    // Validate start and end dates
    const { startDate, endDate } = campaignData;
    const start = new Date(startDate).toISOString();
    const end = new Date(endDate).toISOString();

    if (end < start) {
      throw new ValidationException(
        'End date cannot be earlier than the start date.',
      );
    }

    const campaign = this.campaignRepository.create({
      ...campaignData,
      budget,
    });
    return this.campaignRepository.save(campaign);
  }

  async update(id: number, campaignData: Partial<Campaign>): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({ where: { id } });

    if (!campaign) {
      throw new ValidationException('Campaign not found');
    }

    if (!campaignData.name) {
      throw new ValidationException('Campaign name is required');
    }

    // Check if name is unique
    const existingCampaign = await this.campaignRepository.findOne({
      where: { name: campaignData.name },
    });
    if (existingCampaign) {
      throw new ValidationException('Campaign name must be unique.');
    }

    // Set price to be 0 as a default if not provided
    const budget = campaignData.budget ?? 0;

    // Ensure price is a positive integer
    if (budget < 0 || !Number.isInteger(budget)) {
      throw new ValidationException(
        'Price must be a positive number without decimals.',
      );
    }

    // Validate start and end dates
    const { startDate, endDate } = campaignData;
    const start = new Date(startDate).toISOString();
    const end = new Date(endDate).toISOString();

    if (end < start) {
      throw new ValidationException(
        'End date cannot be earlier than the start date.',
      );
    }

    Object.assign(campaign, campaignData);
    return await this.campaignRepository.save(campaign);
  }

  async delete(id: number): Promise<void> {
    await this.campaignRepository.delete(id);
  }

  async search(name: string): Promise<Campaign[]> {
    return await this.campaignRepository.find({
      where: { name: Like(`%${name}%`) },
    });
  }
}
