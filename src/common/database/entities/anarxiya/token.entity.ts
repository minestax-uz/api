import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ database: 's32_token', name: 'playerpoints_points' })
export class Points {
  @PrimaryColumn()
  id: string;
  
  @Column()
  uuid: string;

  @Column()
  points: number;
}

@Entity({ database: 's32_token', name: 'playerpoints_username_cache' })
export class PointsUsername {
  @PrimaryColumn()
  uuid: string;

  @Column()
  username: string;
}
