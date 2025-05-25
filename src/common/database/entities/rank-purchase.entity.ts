import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
} from 'typeorm';

@Entity('rank_purchases')
export class RankPurchase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  username: string;

  @Column()
  rankId: number;

  @Column()
  transactionId: string;

  @Column()
  amount: number;

  @Column()
  status: 'pending' | 'completed' | 'failed';

  @CreateDateColumn()
  createdAt: Date;

  @Column({ nullable: true })
  completedAt: Date;

  @Column()
  paymentMethod: string;
}
