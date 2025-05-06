import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ database: '', name: 'plan_ping' })
export class PlanPing {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  server_id: number;

  @Column()
  date: number; // Unix timestamp

  @Column()
  max_ping: number;

  @Column()
  min_ping: number;

  @Column({ type: 'double' })
  avg_ping: number;
}
