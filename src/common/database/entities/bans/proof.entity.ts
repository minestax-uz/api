import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ database: 's1_bans', name: 'proofs' })
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

  @CreateDateColumn()
  create_at: string;
}
