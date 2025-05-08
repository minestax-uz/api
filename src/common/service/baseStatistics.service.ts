import { Injectable } from '@nestjs/common';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { HttpError } from 'src/common/exception/http.error';
import {
  PlanUser,
  PlanServer,
  PlanSession,
  PlanKill,
  PlanWorld,
  PlanTps,
  PlanPing,
  PlanNickname,
  PlanGeolocation,
  PlanUserInfo,
} from 'src/common/database/entities/plan';

@Injectable()
export class BaseStatisticsService {
  constructor(
    private readonly planUserRepo: Repository<PlanUser>,
    private readonly planServerRepo: Repository<PlanServer>,
    private readonly planSessionRepo: Repository<PlanSession>,
    private readonly planKillRepo: Repository<PlanKill>,
    private readonly planWorldRepo: Repository<PlanWorld>,
    private readonly planTpsRepo: Repository<PlanTps>,
    private readonly planPingRepo: Repository<PlanPing>,
    private readonly planNicknameRepo: Repository<PlanNickname>,
    private readonly planGeolocationRepo: Repository<PlanGeolocation>,
    private readonly planUserInfoRepo: Repository<PlanUserInfo>,
  ) {}

  async getServerStats(range: number = 24) {
    const tpsData = await this.planTpsRepo.find({
      order: { id: 'DESC' },
      skip: 0,
      take: range,
    });

    return tpsData;
  }

  async getFullServerStats() {
    // Get country distribution using query builder
    const countryStats = await this.planGeolocationRepo
      .createQueryBuilder('geo')
      .select('geolocation')
      .addSelect('COUNT(*)', 'count')
      .groupBy('geolocation')
      .getRawMany()
      .then((results) =>
        results.reduce((acc, { geolocation, count }) => {
          acc[geolocation] = parseInt(count);
          return acc;
        }, {}),
      );

    // Get top killers using query builder
    const topKillers = await this.planKillRepo
      .createQueryBuilder('kill')
      .select('pu.name', 'name')
      .addSelect('COUNT(*)', 'kills')
      .innerJoin(
        this.planUserRepo.metadata.tableName,
        'pu',
        'pu.uuid = kill.killer_uuid',
      )
      .groupBy('kill.killer_uuid')
      .orderBy('kills', 'DESC')
      .limit(10)
      .getRawMany()
      .then((data) => data.map((v) => ({ name: v.name, kills: +v.kills })));

    // Get top playtime using query builder
    const topPlaytime = await this.planSessionRepo
      .createQueryBuilder('session')
      .select('pu.name', 'name')
      .addSelect('SUM(session.session_end - session.session_start)', 'playtime')
      .innerJoin(
        this.planUserRepo.metadata.tableName,
        'pu',
        'pu.id = session.user_id',
      )
      .groupBy('session.user_id')
      .orderBy('playtime', 'DESC')
      .limit(10)
      .getRawMany()
      .then((results) =>
        results.map((p) => ({
          name: p.name,
          playtime: Math.floor(parseInt(p.playtime) / 3600), // Convert to hours
        })),
      );

    const totalPlayers = await this.planUserRepo.count();

    return {
      totalPlayers,
      countryDistribution: countryStats,
      topPlayers: {
        byKills: topKillers,
        byPlaytime: topPlaytime,
      },
    };
  }

  async getPlayerStats(username: string, range: number = 24) {
    const player = await this.planUserRepo.findOne({
      where: { name: username },
    });
    if (!player) throw new HttpError({ code: 'PLAYER_NOT_FOUND' });

    const now = new Date();
    const startTime =
      range === 0 ? 0 : Math.floor(now.getTime() / 1000) - range * 60 * 60;

    const sessions = await this.planSessionRepo.find({
      where: {
        user_id: player.id,
        session_start: MoreThanOrEqual(startTime),
      },
      order: { session_start: 'DESC' },
    });

    let kills = await this.planKillRepo
      .createQueryBuilder('kill')
      .leftJoinAndSelect(
        this.planUserRepo.metadata.tableName,
        'victim',
        'victim.uuid = kill.victim_uuid',
      )
      .where('kill.date >= :startTime', { startTime })
      .andWhere('kill.killer_uuid = :killerUuid', { killerUuid: player.uuid })
      .select('`kill`.*, victim.name as victim_name')
      .getRawMany();

    const total = {
      afk_time: 0,
      deaths: 0,
      kills: kills.length,
      playtime: 0,
      mob_kills: 0,
    };

    for (let session of sessions) {
      total.afk_time += session.afk_time;
      total.deaths += session.deaths;
      total.playtime += session.session_end - session.session_start;
      total.mob_kills += session.mob_kills;
    }

    const killsCompact = {
      players: {},
      weapons: {},
    };

    for (let kill of kills) {
      killsCompact.players[kill.victim_name] =
        (killsCompact.players[kill.victim_name] || 0) + 1;
      killsCompact.weapons[kill.weapon] =
        (killsCompact.weapons[kill.weapon] || 0) + 1;
    }

    killsCompact.players = Object.entries(killsCompact.players)
      .sort((a: any, b: any) => b[1] - a[1])
      .map(([player, count]) => ({ player, count }));
    killsCompact.weapons = Object.entries(killsCompact.weapons)
      .sort((a: any, b: any) => b[1] - a[1])
      .map(([weapon, count]) => ({ weapon, count }));

    const userGeo = await this.planGeolocationRepo.findOne({
      where: { user_id: player.id },
    });

    return {
      total,
      kills: killsCompact,
      lastSeen: sessions.at(-1).session_end,
      registered: player.registered,
      country: userGeo.geolocation,
    };
  }
}
