import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ database: '', name: 'plan_nicknames' })
export class PlanNickname {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 36 })
  uuid: string;

  @Column({ length: 75 })
  nickname: string;

  @Column({ length: 36 })
  server_uuid: string;

  @Column()
  last_used: number; // Unix timestamp
}
