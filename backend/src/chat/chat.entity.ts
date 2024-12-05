import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({ description: 'Unique identifier for the chat message' })
  id: string;

  @Column()
  @ApiProperty({ description: 'The username of the message sender' })
  sender: string;

  @Column()
  @ApiProperty({ description: 'The username of the message receiver' })
  receiver: string;

  @Column('text')
  @ApiProperty({ description: 'Content of the message' })
  content: string;

  @CreateDateColumn()
  @ApiProperty({ description: 'Timestamp when the message was created' })
  createdAt: Date;
}
