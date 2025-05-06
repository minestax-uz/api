import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ database: '', name: 'plan_world_times' })
export class PlanWorldTime {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column()
  world_id: number;

  @Column()
  server_id: number;

  @Column()
  session_id: number;

  @Column({ default: 0 })
  survival_time: number;

  @Column({ default: 0 })
  creative_time: number;

  @Column({ default: 0 })
  adventure_time: number;

  @Column({ default: 0 })
  spectator_time: number;
}
