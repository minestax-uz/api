import { Injectable } from '@nestjs/common';
import { Repository, MoreThanOrEqual, MoreThan } from 'typeorm';
import { HttpError } from 'src/common/exception/http.error';
import { BaseModuleService } from './base-module.service';
import { ModuleAvailabilityService } from './module-availability.service';
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
export class BaseStatisticsService extends BaseModuleService {
  constructor(
    moduleAvailabilityService: ModuleAvailabilityService,
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
  ) {
    super(moduleAvailabilityService);
  }

  async getServerStats(moduleName: string, range: number = 24) {
    // Check if the module is available before proceeding
    this.checkModuleAvailability(moduleName);

    try {
      const tpsData = await this.planTpsRepo.find({
        order: { id: 'DESC' },
        skip: 0,
        take: range,
      });

      return tpsData;
    } catch (error) {
      // If we get an EntityMetadataNotFoundError, it means the module's database is not available
      if (error.name === 'EntityMetadataNotFoundError') {
        // Mark the module as unavailable
        this.moduleAvailabilityService.setModuleAvailability(moduleName, false);
        // Throw a more user-friendly error
        throw HttpError({
          code: 'MODULE_UNAVAILABLE',
          message: `The ${moduleName} module is currently unavailable due to database connection issues`,
          statusCode: 503, // Service Unavailable
        });
      }
      // For other errors, just rethrow
      throw error;
    }
  }

  async getFullServerStats(moduleName: string) {
    // Check if the module is available before proceeding
    this.checkModuleAvailability(moduleName);

    try {
      // Get latest TPS data with online players
      const latestTps = await this.planTpsRepo.findOne({
        where: { id: MoreThan(0) },
        order: { id: 'DESC' },
      });

      const onlinePlayers = latestTps ? latestTps.players_online : 0;
      const totalPlayers = await this.planUserRepo.count();

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
        .addSelect(
          'SUM(session.session_end - session.session_start)',
          'playtime',
        )
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

      return {
        totalPlayers,
        onlinePlayers,
        countryDistribution: countryStats,
        topPlayers: {
          byKills: topKillers,
          byPlaytime: topPlaytime,
        },
      };
    } catch (error) {
      // If we get an EntityMetadataNotFoundError, it means the module's database is not available
      if (error.name === 'EntityMetadataNotFoundError') {
        // Mark the module as unavailable
        this.moduleAvailabilityService.setModuleAvailability(moduleName, false);
        // Throw a more user-friendly error
        throw HttpError({
          code: 'MODULE_UNAVAILABLE',
          message: `The ${moduleName} module is currently unavailable due to database connection issues`,
          statusCode: 503, // Service Unavailable
        });
      }
      // For other errors, just rethrow
      throw error;
    }
  }

  async getPlayerStats(
    moduleName: string,
    username: string,
    range: number = 24,
  ) {
    // Check if the module is available before proceeding
    this.checkModuleAvailability(moduleName);

    try {
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
    } catch (error) {
      // If we get an EntityMetadataNotFoundError, it means the module's database is not available
      if (error.name === 'EntityMetadataNotFoundError') {
        // Mark the module as unavailable
        this.moduleAvailabilityService.setModuleAvailability(moduleName, false);
        // Throw a more user-friendly error
        throw HttpError({
          code: 'MODULE_UNAVAILABLE',
          message: `The ${moduleName} module is currently unavailable due to database connection issues`,
          statusCode: 503, // Service Unavailable
        });
      }
      // For other errors, just rethrow
      throw error;
    }
  }
}
