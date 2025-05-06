import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ database: '', name: 'plan_sessions' })
export class PlanSession {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  server_id: number;

  @Column()
  session_start: number; // Unix timestamp

  @Column()
  session_end: number; // Unix timestamp

  @Column()
  mob_kills: number;

  @Column()
  deaths: number;

  @Column()
  afk_time: number;

  @Column({ default: 1 })
  join_address_id: number;
}
