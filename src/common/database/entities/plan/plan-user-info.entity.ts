import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ database: '', name: 'plan_user_info' })
export class PlanUserInfo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  server_id: number;

  @Column({ length: 191 })
  join_address: string;

  @Column()
  registered: number; // Unix timestamp

  @Column({ type: 'tinyint', default: 0 })
  opped: number;

  @Column({ type: 'tinyint', default: 0 })
  banned: number;
}
