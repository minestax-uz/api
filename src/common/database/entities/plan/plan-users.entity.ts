import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ database: '', name: 'plan_users' })
export class PlanUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 36 })
  uuid: string;

  @Column()
  registered: number; // Unix timestamp

  @Column({ length: 36 })
  name: string;

  @Column({ default: 0 })
  times_kicked: number;
}
