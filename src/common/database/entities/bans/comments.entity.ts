import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ database: 's1_bans', name: 'comments' })
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ban_id: number;

  @Column()
  author_name: string;

  @Column()
  content: string;

  @CreateDateColumn()
  created_at: string;
}
