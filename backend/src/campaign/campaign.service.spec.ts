import { Test, TestingModule } from '@nestjs/testing';
import { CampaignService } from './campaign.service';
import { CampaignRepository } from './campaign.repository';
import { KafkaService } from '../kafka/kafka.service';
import { RedisService } from '../redis/redis.service';
import { ValidationException } from '../common/exceptions/validation.exception';

describe('CampaignService', () => {
  let service: CampaignService;
  let repository: jest.Mocked<CampaignRepository>;
  let kafkaService: jest.Mocked<KafkaService>;
  let redisService: jest.Mocked<RedisService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CampaignService,
        {
          provide: CampaignRepository,
          useValue: {
            findAndCount: jest.fn(),
            findOneById: jest.fn(),
            findByName: jest.fn(),
            findByExactName: jest.fn(),
            createCampaign: jest.fn(),
            updateCampaign: jest.fn(),
            deleteCampaign: jest.fn(),
          },
        },
        {
          provide: KafkaService,
          useValue: {
            emit: jest.fn(),
          },
        },
        {
          provide: RedisService,
          useValue: {
            get: jest.fn(),
            set: jest.fn(),
            delMatching: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<CampaignService>(CampaignService);
    repository = module.get(CampaignRepository);
    kafkaService = module.get(KafkaService);
    redisService = module.get(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fetch all campaigns with pagination', async () => {
    const mockCampaigns = [
      {
        id: 1,
        name: 'Campaign 1',
        budget: 5000,
        startDate: new Date(),
        endDate: new Date(),
      },
      {
        id: 2,
        name: 'Campaign 2',
        budget: 10000,
        startDate: new Date(),
        endDate: new Date(),
      },
    ];

    jest.spyOn(redisService, 'get').mockResolvedValue(null); // No cached data
    jest
      .spyOn(repository, 'findAndCount')
      .mockResolvedValue([mockCampaigns, mockCampaigns.length]);

    const result = await service.findAll(1, 10);

    expect(result).toEqual({
      data: mockCampaigns,
      total: mockCampaigns.length,
      page: 1,
      limit: 10,
    });

    expect(redisService.set).toHaveBeenCalledWith(
      'campaigns_page_1_limit_10',
      { data: mockCampaigns, total: mockCampaigns.length, page: 1, limit: 10 },
      3600,
    );
  });

  it('should create a campaign successfully', async () => {
    const campaignData = {
      name: 'Test Campaign',
      budget: 1000,
      startDate: new Date(),
      endDate: new Date(),
    };
    const createdCampaign = { id: 1, ...campaignData };

    jest.spyOn(repository, 'createCampaign').mockResolvedValue(createdCampaign);

    const result = await service.create(campaignData);

    expect(repository.createCampaign).toHaveBeenCalledWith(campaignData);
    expect(kafkaService.emit).toHaveBeenCalledWith(
      'campaign.created',
      createdCampaign,
    );
    expect(redisService.delMatching).toHaveBeenCalledWith('campaigns_*');
    expect(result).toEqual(createdCampaign);
  });

  it('should update a campaign successfully', async () => {
    const campaignData = {
      id: 1,
      name: 'Updated Campaign',
      budget: 2000,
      startDate: new Date(),
      endDate: new Date(),
    };
    const existingCampaign = {
      id: 1,
      name: 'Old Campaign',
      budget: 1000,
      startDate: new Date(),
      endDate: new Date(),
    };

    jest.spyOn(repository, 'findOneById').mockResolvedValue(existingCampaign);
    jest.spyOn(repository, 'updateCampaign').mockResolvedValue(campaignData);

    const result = await service.update(1, campaignData);

    expect(repository.findOneById).toHaveBeenCalledWith(1);
    expect(repository.updateCampaign).toHaveBeenCalledWith({
      ...existingCampaign,
      ...campaignData,
    });
    expect(kafkaService.emit).toHaveBeenCalledWith(
      'campaign.updated',
      campaignData,
    );
    expect(redisService.delMatching).toHaveBeenCalledWith('campaigns_*');
    expect(result).toEqual(campaignData);
  });

  it('should delete a campaign successfully', async () => {
    jest.spyOn(repository, 'deleteCampaign').mockResolvedValue();

    await service.delete(1);

    expect(repository.deleteCampaign).toHaveBeenCalledWith(1);
    expect(kafkaService.emit).toHaveBeenCalledWith('campaign.deleted', {
      id: 1,
    });
    expect(redisService.delMatching).toHaveBeenCalledWith('campaigns_*');
  });

  it('should throw an error when campaign is not found for update', async () => {
    jest.spyOn(repository, 'findOneById').mockResolvedValue(null);

    await expect(
      service.update(999, { name: 'Nonexistent Campaign' }),
    ).rejects.toThrow(ValidationException);

    expect(repository.findOneById).toHaveBeenCalledWith(999);
  });
});
