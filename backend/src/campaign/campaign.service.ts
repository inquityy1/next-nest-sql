import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Campaign } from './campaign.entity';

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

  async create(campaignData: Campaign): Promise<Campaign> {
    const campaign = this.campaignRepository.create(campaignData);
    return this.campaignRepository.save(campaign);
  }

  async update(id: number, campaignData: Partial<Campaign>): Promise<Campaign> {
    const campaign = await this.campaignRepository.findOne({ where: { id } });

    if (!campaign) {
      throw new Error('Campaign not found');
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
