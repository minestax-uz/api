import { Column, PrimaryColumn } from 'typeorm';

export class Player {
  @PrimaryColumn()
  uuid: string;

  @Column()
  username: string;
}

export class Group {
  @PrimaryColumn()
  name: string;
}

export class PlayerPermissions {
  @PrimaryColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  permission: string;

  @Column()
  value: boolean;

  @Column()
  server: string;

  @Column()
  world: string;

  @Column()
  expiry: number;

  @Column()
  contexts: string;
}

export class GroupPermissions {
  @PrimaryColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  permission: string;

  @Column()
  value: boolean;
}
