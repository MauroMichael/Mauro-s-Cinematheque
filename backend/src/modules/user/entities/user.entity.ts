import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Status } from '../enum';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('varchar', { length: 100 })
  firstName: string;

  @Column('varchar', { length: 100 })
  lastName: string;

  @Column('varchar', { length: 100, unique: true })
  email: string;

  @Column('varchar', { length: 100, nullable: true })
  phoneNumber?: string;

  @Column({
    type: 'enum',
    enum: Status,
    default: 'PENDING',
  })
  status: Status;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
