import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ database: '', name: 'plan_geolocations' })
export class PlanGeolocation {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column({ length: 50 })
  geolocation: string;

  @Column({ default: 0 })
  last_used: number; // Unix timestamp
}
