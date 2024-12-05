import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { Campaign } from '../src/campaign/campaign.entity';
import { CampaignRepository } from '../src/campaign/campaign.repository';
import {
  getDataSourceToken,
  getRepositoryToken,
  TypeOrmModule,
} from '@nestjs/typeorm';

describe('CampaignRepository Integration Tests', () => {
  let repository: CampaignRepository;
  let dataSource: DataSource;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: 'localhost',
          port: 5432,
          username: 'postgres',
          password: 'qqwwee11',
          database: 'nextandnest',
          entities: [Campaign],
          synchronize: true,
        }),
        TypeOrmModule.forFeature([Campaign]),
      ],
      providers: [CampaignRepository],
    }).compile();

    repository = module.get<CampaignRepository>(CampaignRepository);
    dataSource = module.get<DataSource>(getDataSourceToken());
  });

  afterAll(async () => {
    if (dataSource) {
      await dataSource.destroy();
    }
  });

  afterEach(async () => {
    const queryRunner = dataSource.createQueryRunner();
    await queryRunner.query(
      'TRUNCATE TABLE "campaign" RESTART IDENTITY CASCADE;',
    );
    await queryRunner.release();
  });

  it('should create and retrieve a campaign by exact name', async () => {
    const campaignData = {
      name: 'Test Campaign',
      budget: 5000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    };
    const createdCampaign = await repository.createCampaign(campaignData);
    expect(createdCampaign).toBeDefined();
    expect(createdCampaign.id).toBeDefined();
    expect(createdCampaign.name).toBe(campaignData.name);

    const foundCampaign = await repository.findByExactName(campaignData.name);
    expect(foundCampaign).toBeDefined();
    expect(foundCampaign?.name).toBe(campaignData.name);
    expect(foundCampaign?.budget).toBe(campaignData.budget);
    expect(foundCampaign?.startDate).toEqual(campaignData.startDate);
    expect(foundCampaign?.endDate).toEqual(campaignData.endDate);
  });

  it('should find campaigns by name pattern', async () => {
    const campaignData1 = {
      name: 'Test Campaign 1',
      budget: 1000,
      startDate: new Date('2024-02-01'),
      endDate: new Date('2024-06-30'),
    };
    const campaignData2 = {
      name: 'Test Campaign 2',
      budget: 2000,
      startDate: new Date('2024-03-01'),
      endDate: new Date('2024-09-30'),
    };
    await repository.createCampaign(campaignData1);
    await repository.createCampaign(campaignData2);

    const foundCampaigns = await repository.findByName('Test Campaign');
    expect(foundCampaigns.length).toBe(2);
    expect(foundCampaigns.map((c) => c.name)).toEqual(
      expect.arrayContaining(['Test Campaign 1', 'Test Campaign 2']),
    );
  });

  it('should find and count campaigns with pagination', async () => {
    for (let i = 1; i <= 10; i++) {
      await repository.createCampaign({
        name: `Campaign ${i}`,
        budget: 1000 * i,
        startDate: new Date(`2024-01-01`),
        endDate: new Date(`2024-12-31`),
      });
    }

    const [campaigns, count] = await repository.findAndCount(1, 5);
    expect(count).toBe(10);
    expect(campaigns.length).toBe(5);
    expect(campaigns.map((c) => c.name)).toEqual(
      expect.arrayContaining([
        'Campaign 1',
        'Campaign 2',
        'Campaign 3',
        'Campaign 4',
        'Campaign 5',
      ]),
    );
  });

  it('should update a campaign', async () => {
    const campaignData = {
      name: 'Test Campaign',
      budget: 5000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    };
    const createdCampaign = await repository.createCampaign(campaignData);

    createdCampaign.budget = 6000;
    createdCampaign.endDate = new Date('2024-11-30');
    const updatedCampaign = await repository.updateCampaign(createdCampaign);

    expect(updatedCampaign).toBeDefined();
    expect(updatedCampaign.id).toBe(createdCampaign.id);
    expect(updatedCampaign.budget).toBe(6000);
    expect(updatedCampaign.endDate).toEqual(new Date('2024-11-30'));
  });

  it('should delete a campaign by ID', async () => {
    const campaignData = {
      name: 'Test Campaign',
      budget: 5000,
      startDate: new Date('2024-01-01'),
      endDate: new Date('2024-12-31'),
    };
    const createdCampaign = await repository.createCampaign(campaignData);

    await repository.deleteCampaign(createdCampaign.id);

    const deletedCampaign = await repository.findOneById(createdCampaign.id);
    expect(deletedCampaign).toBeNull();
  });
});
