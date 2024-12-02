import { Test, TestingModule } from '@nestjs/testing';
import { CampaignService } from './campaign.service';
import { Repository } from 'typeorm';
import { Campaign } from './campaign.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { KafkaService } from '../kafka/kafka.service';
import { RedisService } from '../redis/redis.service';
import {
  validateCampaignName,
  validateBudget,
  validateDates,
} from '../common/utils/validation.utils';
import { ValidationException } from '../common/exceptions/validation.exception';

jest.mock('../common/utils/validation.utils', () => ({
  validateCampaignName: jest.fn(),
  validateBudget: jest.fn(),
  validateDates: jest.fn(),
}));

jest.mock('../kafka/kafka.service', () => ({
  KafkaService: jest.fn().mockImplementation(() => ({
    emit: jest.fn(),
  })),
}));

jest.mock('../redis/redis.service', () => ({
  RedisService: jest.fn().mockImplementation(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delMatching: jest.fn(),
  })),
}));

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
  let kafkaService: KafkaService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignService,
        {
          provide: getRepositoryToken(Campaign),
          useValue: mockCampaignRepository(),
        },
        KafkaService,
        RedisService,
      ],
    }).compile();

    campaignService = module.get<CampaignService>(CampaignService);
    campaignRepository = module.get<Repository<Campaign>>(
      getRepositoryToken(Campaign),
    );
    kafkaService = module.get<KafkaService>(KafkaService);
    redisService = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch all campaigns with pagination', async () => {
    const mockData = [[{ id: 1, name: 'Campaign 1' }], 1];
    campaignRepository.findAndCount = jest.fn().mockResolvedValue(mockData);

    const result = await campaignService.findAll(1, 10);

    expect(campaignRepository.findAndCount).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
    });

    expect(result).toEqual({
      data: [{ id: 1, name: 'Campaign 1' }],
      total: 1,
      page: 1,
      limit: 10,
    });
  });

  it('should create a campaign successfully', async () => {
    const campaignData = {
      name: 'Campaign 1',
      budget: 100,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-01-10'),
    };

    (validateCampaignName as jest.Mock).mockResolvedValue(true);
    (validateBudget as jest.Mock).mockReturnValue(true);
    (validateDates as jest.Mock).mockReturnValue(true);

    campaignRepository.create = jest.fn().mockReturnValue(campaignData);
    campaignRepository.save = jest.fn().mockResolvedValue({
      id: 1,
      ...campaignData,
    });

    const result = await campaignService.create(campaignData);

    expect(validateCampaignName).toHaveBeenCalledWith(
      campaignData.name,
      campaignRepository,
    );
    expect(validateBudget).toHaveBeenCalledWith(campaignData.budget);
    expect(validateDates).toHaveBeenCalledWith(
      campaignData.startDate,
      campaignData.endDate,
    );
    expect(campaignRepository.save).toHaveBeenCalledWith(campaignData);
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

  it('should handle validation errors during creation', async () => {
    const campaignData = {
      name: 'Invalid Campaign',
      budget: -10,
      startDate: new Date(),
      endDate: new Date(),
    };

    (validateCampaignName as jest.Mock).mockImplementation(() => {
      throw new ValidationException('Invalid name');
    });

    await expect(campaignService.create(campaignData)).rejects.toThrow(
      ValidationException,
    );
    expect(validateCampaignName).toHaveBeenCalledWith(
      campaignData.name,
      campaignRepository,
    );
  });
});
