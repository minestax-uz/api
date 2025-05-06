import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ database: '', name: 'plan_tps' })
export class PlanTps {
  @PrimaryColumn()
  server_id: number;

  @Column()
  date: number; // Unix timestamp

  @Column({ type: 'double' })
  tps: number;

  @Column()
  players_online: number;

  @Column({ type: 'double' })
  cpu_usage: number;

  @Column()
  ram_usage: number;

  @Column()
  entities: number;

  @Column()
  chunks_loaded: number;

  @Column()
  free_disk_space: number;
}
