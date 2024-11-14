import { ValidationException } from '../exceptions/validation.exception';
import { Not, Repository } from 'typeorm';
import { Campaign } from 'src/campaign/campaign.entity';

export async function validateCampaignName(
  name: string,
  campaignRepository: Repository<Campaign>,
  currentCampaignId?: number,
): Promise<void> {
  if (!name) {
    throw new ValidationException('Campaign name is required');
  }

  const existingCampaign = await campaignRepository.findOne({
    where: { name, id: currentCampaignId ? Not(currentCampaignId) : undefined },
  });

  if (existingCampaign) {
    throw new ValidationException('Campaign name must be unique.');
  }
}

/**
 * Validates budget to be a positive integer without decimals.
 */
export function validateBudget(budget: number) {
  if (budget < 0 || !Number.isInteger(budget)) {
    throw new ValidationException(
      'Price must be a positive number without decimals.',
    );
  }
}

export function validateDates(
  startDate?: string | Date,
  endDate?: string | Date,
): void {
  if (!startDate) {
    throw new ValidationException('Start date is required.');
  }

  const start = new Date(startDate);
  if (isNaN(start.getTime())) {
    throw new ValidationException('Invalid start date.');
  }

  if (endDate) {
    const end = endDate ? new Date(endDate) : new Date(startDate);
    if (isNaN(end.getTime())) {
      throw new ValidationException('Invalid end date.');
    }
    if (end < start) {
      throw new ValidationException(
        'End date cannot be earlier than the start date.',
      );
    }
  }
}
