import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('ranks')
export class Rank {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  price: number;

  @Column()
  description: string;

  @Column('simple-array')
  permissions: string[];

  @Column()
  duration: number; // Duration in days, 0 for permanent

  @Column({ default: true })
  enabled: boolean;

  @Column()
  serverType: 'anarxiya' | 'survival' | 'boxpvp';
}
