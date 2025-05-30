import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'proofs' })
export class Proof {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ban_id: number;

  @Column()
  moderator_name: string;

  @Column()
  file_path: string;

  @Column()
  file_type: string;
}
