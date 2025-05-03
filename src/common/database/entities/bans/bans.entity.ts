import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ database: 's1_bans', name: 'litebans_bans' })
export class Bans {
  @PrimaryColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  reason: string;

  @Column()
  banned_by_uuid: string;

  @Column()
  banned_by_name: string;

  @Column()
  removed_by_uuid: string;

  @Column()
  removed_by_name: string;

  @Column()
  removed_by_reason: string;

  @Column()
  removed_by_date: string;

  @Column()
  time: number;

  @Column()
  until: number;

  @Column()
  active: boolean;
}
