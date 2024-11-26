import { Test, TestingModule } from '@nestjs/testing';
import { CampaignService } from './campaign.service';
import { Repository } from 'typeorm';
import { Campaign } from './campaign.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

const mockCampaignRepository = () => ({
  findAndCount: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
  findOne: jest.fn(),
  find: jest.fn(),
});

describe('CampaignService', () => {
  let campaignService: CampaignService;
  let campaignRepository: Repository<Campaign>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignService,
        {
          provide: getRepositoryToken(Campaign),
          useValue: mockCampaignRepository(),
        },
      ],
    }).compile();

    campaignService = module.get<CampaignService>(CampaignService);
    campaignRepository = module.get<Repository<Campaign>>(
      getRepositoryToken(Campaign),
    );
  });

  it('should fetch all campaigns with pagination', async () => {
    const mockData = [[{ id: 1, name: 'Campaign 1' }], 1];
    campaignRepository.findAndCount = jest.fn().mockResolvedValue(mockData);

    const result = await campaignService.findAll(1, 10);

    // Ensure findAndCount was called with the correct arguments
    expect(campaignRepository.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
    });

    // Check if the result matches the expected output
    expect(result).toEqual({
      data: [{ id: 1, name: 'Campaign 1' }],
      total: 1,
      page: 1,
      limit: 10,
    });
  });

  it('should create a campaign successfully', async () => {
    const campaignData = {
      id: 1,
      name: 'Campaign 1',
      budget: 100,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-10'),
    };
    campaignRepository.create = jest
      .fn()
      .mockResolvedValue(campaignData as Campaign);
    campaignRepository.save = jest
      .fn()
      .mockResolvedValue({ id: 1, ...campaignData });

    const result = await campaignService.create(campaignData);
    expect(result).toEqual({ id: 1, ...campaignData });
  });

  it('should throw an error when campaign is not found for update', async () => {
    campaignRepository.findOne = jest.fn().mockResolvedValue(null);

    await expect(
      campaignService.update(1, { name: 'Updated Campaign' }),
    ).rejects.toThrow('Campaign not found');
  });

  it('should delete a campaign successfully', async () => {
    campaignRepository.delete = jest.fn().mockResolvedValue({ affected: 1 });

    await expect(campaignService.delete(1)).resolves.not.toThrow();
    expect(campaignRepository.delete).toHaveBeenCalledWith(1);
  });
});
