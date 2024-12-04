import { Injectable } from '@nestjs/common';
import { Repository, Like } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from './campaign.entity';

@Injectable()
export class CampaignRepository {
  constructor(
    @InjectRepository(Campaign)
    private readonly repository: Repository<Campaign>,
  ) {}

  async findAndCount(
    page: number,
    limit: number,
  ): Promise<[Campaign[], number]> {
    return this.repository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
    });
  }

  async findOneById(id: number): Promise<Campaign | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByName(name: string): Promise<Campaign[]> {
    return this.repository.find({ where: { name: Like(`%${name}%`) } });
  }

  async findByExactName(name: string): Promise<Campaign | null> {
    return this.repository.findOne({ where: { name } });
  }

  async createCampaign(campaign: Partial<Campaign>): Promise<Campaign> {
    const newCampaign = this.repository.create(campaign);
    return this.repository.save(newCampaign);
  }

  async updateCampaign(campaign: Campaign): Promise<Campaign> {
    return this.repository.save(campaign);
  }

  async deleteCampaign(id: number): Promise<void> {
    await this.repository.delete(id);
  }
}
