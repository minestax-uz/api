import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ database: '', name: 'plan_worlds' })
export class PlanWorld {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  world_name: string;

  @Column({ length: 36 })
  server_uuid: string;
}
