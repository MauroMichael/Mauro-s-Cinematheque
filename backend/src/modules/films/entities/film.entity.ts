import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Format, Status } from '../enum';

@Entity()
export class Film {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  name: string;

  @Column('varchar', { length: 100, nullable: true })
  country?: string;

  @Column('int', { nullable: true })
  year?: number;

  @Column('int', { nullable: true })
  length?: number;

  @Column('varchar', { length: 100, nullable: true })
  genre?: string;

  @Column('varchar', { length: 100, nullable: true })
  sector?: string;

  @Column('varchar', { length: 100, nullable: true })
  imageUrl?: string;

  @Column('int', { nullable: true })
  code?: number;

  @Column({
    type: 'enum',
    enum: Status,
    default: 'ACTIVE',
  })
  status: Status;

  @Column({
    type: 'enum',
    enum: Format,
  })
  format: Format;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
