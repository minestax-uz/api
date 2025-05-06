import { Column, PrimaryColumn } from 'typeorm';

// Base entity for server statistics
export class ServerStats {
  @PrimaryColumn()
  id: number;

  @Column()
  server_name: string;

  @Column()
  online_players: number;

  @Column()
  max_players: number;

  @Column()
  uptime: string;

  @Column()
  tps: number;

  @Column()
  cpu_usage: number;

  @Column()
  memory_usage: number;

  @Column()
  memory_total: number;
}

// Base entity for player statistics
export class PlayerStats {
  @PrimaryColumn()
  uuid: string;

  @Column()
  username: string;

  @Column()
  registered: number; // Unix timestamp

  @Column()
  last_seen: number; // Unix timestamp

  @Column()
  playtime: number; // In seconds

  @Column()
  active_playtime: number; // In seconds (active gameplay)

  @Column()
  afk_time: number; // In seconds
}

// Base entity for player kills statistics
export class PlayerKills {
  @PrimaryColumn()
  uuid: string;

  @Column()
  player_kills: number;

  @Column()
  player_deaths: number;

  @Column()
  mob_kills: number;

  @Column()
  mob_deaths: number;

  @Column()
  kdr: number; // Kill/Death Ratio
}

// Base entity for player activity statistics
export class PlayerActivity {
  @PrimaryColumn()
  uuid: string;

  @Column()
  blocks_placed: number;

  @Column()
  blocks_broken: number;

  @Column()
  items_crafted: number;

  @Column()
  distance_traveled: number; // In meters
}

// Base entity for session data
export class Session {
  @PrimaryColumn()
  id: number;

  @Column()
  uuid: string;

  @Column()
  server_id: number;

  @Column()
  start: number; // Unix timestamp

  @Column()
  end: number; // Unix timestamp

  @Column()
  length: number; // In seconds

  @Column()
  afk_time: number; // In seconds
}
