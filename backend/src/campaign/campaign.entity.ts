import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Campaign {
  @PrimaryGeneratedColumn()
  @ApiProperty({ description: 'Unique identifier for the campaign' })
  id: number;

  @Column()
  @ApiProperty({ description: 'Name of the campaign' })
  name: string;

  @Column()
  @ApiProperty({ description: 'Budget allocated to the campaign' })
  budget: number;

  @Column()
  @ApiProperty({ description: 'Start date of the campaign' })
  startDate: Date;

  @Column()
  @ApiProperty({ description: 'End date of the campaign' })
  endDate: Date;
}
