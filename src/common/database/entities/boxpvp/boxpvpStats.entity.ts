import { Entity } from 'typeorm';
import {
  ServerStats as RootServerStats,
  PlayerStats as RootPlayerStats,
  PlayerKills as RootPlayerKills,
  PlayerActivity as RootPlayerActivity,
  Session as RootSession,
} from '../root/statistics.entity';

@Entity({ database: '', name: '' })
export class ServerStats extends RootServerStats {}

@Entity({ database: '', name: '' })
export class PlayerStats extends RootPlayerStats {}

@Entity({ database: '', name: '' })
export class PlayerKills extends RootPlayerKills {}

@Entity({ database: '', name: '' })
export class PlayerActivity extends RootPlayerActivity {}

@Entity({ database: '', name: '' })
export class Session extends RootSession {}
