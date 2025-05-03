import { Exclude } from 'class-transformer';
import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity({ database: 's1_auth', name: 'user_profiles' })
export class Auth {
  @PrimaryColumn()
  uniqueId: string;

  @Column()
  lastNickname: string;

  @Column()
  lastAddress: string;

  @Column()
  lastSeen: string;

  @Column()
  firstAddress: string;

  @Column()
  firstSeen: string;

  @Column()
  @Exclude()
  hashedPassword: string;
}
