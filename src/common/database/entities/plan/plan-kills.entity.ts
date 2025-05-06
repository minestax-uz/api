import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ database: '', name: 'plan_kills' })
export class PlanKill {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 36 })
  killer_uuid: string;

  @Column({ length: 36 })
  victim_uuid: string;

  @Column({ length: 36 })
  server_uuid: string;

  @Column({ length: 30 })
  weapon: string;

  @Column()
  date: number; // Unix timestamp

  @Column()
  session_id: number;
}
