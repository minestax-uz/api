import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ database: '', name: 'plan_servers' })
export class PlanServer {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 36 })
  uuid: string;

  @Column({ length: 100 })
  name: string;

  @Column({ length: 100 })
  web_address: string;

  @Column({ type: 'tinyint', default: 1 })
  is_installed: number;

  @Column({ type: 'tinyint', default: 0 })
  is_proxy: number;

  @Column({ length: 18, default: 'Old' })
  plan_version: string;
}
