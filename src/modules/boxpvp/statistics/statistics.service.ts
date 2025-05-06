import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, MoreThanOrEqual } from 'typeorm';
import { HttpError } from 'src/common/exception/http.error';
import {
  BoxpvpPlanUser,
  BoxpvpPlanServer,
  BoxpvpPlanSession,
  BoxpvpPlanKill,
  BoxpvpPlanWorldTime,
  BoxpvpPlanWorld,
  BoxpvpPlanTps,
  BoxpvpPlanPing,
  BoxpvpPlanNickname,
  BoxpvpPlanGeolocation,
  BoxpvpPlanUserInfo,
} from 'src/common/database/entities/boxpvp/boxpvpPlan.entity';
import { GetServerStatsDto } from './dto/get-server-stats.dto';
import { GetPlayerStatsDto } from './dto/get-player-stats.dto';
import { GetLeaderboardDto, LeaderboardType } from './dto/get-leaderboard.dto';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(BoxpvpPlanUser)
    private readonly planUserRepo: Repository<BoxpvpPlanUser>,
    @InjectRepository(BoxpvpPlanServer)
    private readonly planServerRepo: Repository<BoxpvpPlanServer>,
    @InjectRepository(BoxpvpPlanSession)
    private readonly planSessionRepo: Repository<BoxpvpPlanSession>,
    @InjectRepository(BoxpvpPlanKill)
    private readonly planKillRepo: Repository<BoxpvpPlanKill>,
    @InjectRepository(BoxpvpPlanWorldTime)
    private readonly planWorldTimeRepo: Repository<BoxpvpPlanWorldTime>,
    @InjectRepository(BoxpvpPlanWorld)
    private readonly planWorldRepo: Repository<BoxpvpPlanWorld>,
    @InjectRepository(BoxpvpPlanTps)
    private readonly planTpsRepo: Repository<BoxpvpPlanTps>,
    @InjectRepository(BoxpvpPlanPing)
    private readonly planPingRepo: Repository<BoxpvpPlanPing>,
    @InjectRepository(BoxpvpPlanNickname)
    private readonly planNicknameRepo: Repository<BoxpvpPlanNickname>,
    @InjectRepository(BoxpvpPlanGeolocation)
    private readonly planGeolocationRepo: Repository<BoxpvpPlanGeolocation>,
    @InjectRepository(BoxpvpPlanUserInfo)
    private readonly planUserInfoRepo: Repository<BoxpvpPlanUserInfo>,
  ) {}

  async getServerStats(dto: GetServerStatsDto) {
    try {
      const server = await this.planServerRepo.findOne({
        where: { name: 'boxpvp' },
      });
      if (!server) {
        return this.getDefaultServerStats();
      }

      const range = dto.range || 24;
      const now = Math.floor(Date.now() / 1000);
      const startTime = now - range * 3600;

      // Debug log to check timestamps
      console.log(
        `BoxPVP - Current timestamp: ${now}, Start time: ${startTime}`,
      );

      // For BoxPVP, we need to handle both millisecond and second timestamps
      // We'll query with a very old timestamp to ensure we get all data
      const veryOldTimestamp = 0; // Start from Unix epoch

      const [tpsData, tpsForActivity] = await Promise.all([
        this.planTpsRepo.find({
          where: { server_id: server.id },
          order: { date: 'DESC' },
          take: 24,
        }),
        this.planTpsRepo.find({
          where: {
            server_id: server.id,
            date: MoreThanOrEqual(veryOldTimestamp), // Get all data and filter in memory
          },
          order: { date: 'ASC' },
        }),
      ]);

      // Filter the TPS data to only include recent data (last 24 hours)
      // This handles both millisecond and second timestamps
      const filteredTpsForActivity = tpsForActivity.filter((tps) => {
        const tpsDateInSeconds =
          tps.date > 10000000000 ? Math.floor(tps.date / 1000) : tps.date;
        return tpsDateInSeconds >= startTime;
      });

      // Debug log to check retrieved data
      console.log(
        `BoxPVP - TPS data count: ${tpsData.length}, Raw TPS for activity count: ${tpsForActivity.length}, Filtered count: ${filteredTpsForActivity.length}`,
      );
      if (filteredTpsForActivity.length > 0) {
        console.log(
          `BoxPVP - Sample TPS data: date=${filteredTpsForActivity[0].date}, players_online=${filteredTpsForActivity[0].players_online}`,
        );
      }

      const playerActivity = this.processPlayerActivity(
        filteredTpsForActivity,
        now,
      );
      const { tpsAvg, cpuAvg, latestTps } = this.calculateAverages(tpsData);
      const uptime = this.calculateUptime(now, latestTps?.date);

      // Ensure we have 24 hours of player activity data
      const fullPlayerActivity = [];
      for (let hour = 0; hour < 24; hour++) {
        const hourStr = `${hour.toString().padStart(2, '0')}:00`;
        const existingEntry = playerActivity.find(
          (entry) => entry.time === hourStr,
        );
        if (existingEntry) {
          fullPlayerActivity.push(existingEntry);
        } else {
          fullPlayerActivity.push({ time: hourStr, count: 0 });
        }
      }

      return {
        onlinePlayers: latestTps?.players_online || 0,
        uptime,
        tps: Number(tpsAvg.toFixed(2)), // Round to 2 decimal places
        cpuUsage: Number(cpuAvg.toFixed(2)), // Round to 2 decimal places
        memoryUsage: latestTps?.ram_usage || 0,
        playerActivity: fullPlayerActivity,
      };
    } catch (error) {
      console.error('Error fetching server stats:', error);
      return HttpError({ code: 'SERVER_STATS_ERROR' });
    }
  }

  private getDefaultServerStats() {
    return {
      onlinePlayers: 0,
      uptime: '0 days, 0 hours',
      tps: 20,
      cpuUsage: 0,
      memoryUsage: 0,
      playerActivity: [],
    };
  }

  private processPlayerActivity(tpsForActivity: BoxpvpPlanTps[], now: number) {
    // Debug log to check TPS data
    console.log(
      `BoxPVP processPlayerActivity - TPS data count: ${tpsForActivity.length}`,
    );
    if (tpsForActivity.length > 0) {
      console.log(
        `BoxPVP processPlayerActivity - First TPS entry: date=${tpsForActivity[0].date}, players_online=${tpsForActivity[0].players_online}`,
      );
      console.log(
        `BoxPVP processPlayerActivity - Last TPS entry: date=${tpsForActivity[tpsForActivity.length - 1].date}, players_online=${tpsForActivity[tpsForActivity.length - 1].players_online}`,
      );
    }

    // Initialize hourly buckets for the last 24 hours
    const hourlyPlayerCounts = new Map<number, number>();
    const range = 24; // 24 hours
    for (let hour = 0; hour < range; hour++) {
      const hourTimestamp = now - (range - hour) * 3600;
      hourlyPlayerCounts.set(hourTimestamp, 0);
    }

    // Process TPS data to get max player count for each hour
    tpsForActivity.forEach((tpsData) => {
      // Log the raw TPS data for debugging
      console.log(
        `Processing TPS entry: date=${tpsData.date}, players=${tpsData.players_online}`,
      );

      // Convert milliseconds to seconds if needed
      const tpsDateInSeconds =
        tpsData.date > 10000000000
          ? Math.floor(tpsData.date / 1000)
          : tpsData.date;
      console.log(`Converted timestamp: ${tpsDateInSeconds} seconds`);

      // Get the hour timestamp
      const hourTimestamp = Math.floor(tpsDateInSeconds / 3600) * 3600;
      console.log(
        `Hour timestamp: ${hourTimestamp}, Hour: ${new Date(hourTimestamp * 1000).toISOString()}`,
      );

      // Direct hour match - simpler approach
      for (const [bucketTime, count] of hourlyPlayerCounts.entries()) {
        // Get hour parts of both timestamps for comparison
        const bucketHour = new Date(bucketTime * 1000).getHours();
        const dataHour = new Date(hourTimestamp * 1000).getHours();

        console.log(
          `Comparing bucket hour ${bucketHour} with data hour ${dataHour}`,
        );

        // If hours match, update the player count
        if (bucketHour === dataHour) {
          console.log(
            `Found matching hour bucket! Updating count from ${count} to ${Math.max(count, tpsData.players_online)}`,
          );
          hourlyPlayerCounts.set(
            bucketTime,
            Math.max(count, tpsData.players_online),
          );
        }
      }
    });

    // Convert to array for the response
    const playerActivity = Array.from(hourlyPlayerCounts.entries())
      .map(([time, count]) => {
        // Format time as HH:MM ensuring we only get hours and minutes
        const date = new Date(time * 1000);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return {
          time: `${hours}:${minutes}`,
          count,
        };
      })
      .sort((a, b) => a.time.localeCompare(b.time));

    // Debug log the processed activity data
    console.log(
      `BoxPVP processPlayerActivity - Processed ${playerActivity.length} activity entries`,
    );
    console.log(
      `BoxPVP processPlayerActivity - Sample: ${JSON.stringify(playerActivity.slice(0, 3))}`,
    );

    return playerActivity;
  }

  private calculateAverages(tpsData: BoxpvpPlanTps[]) {
    const latestTps = tpsData[0] || null;
    const tpsAvg =
      tpsData.reduce((sum, data) => sum + data.tps, 0) / (tpsData.length || 1);
    const cpuAvg =
      tpsData.reduce((sum, data) => sum + data.cpu_usage, 0) /
      (tpsData.length || 1);
    return { tpsAvg, cpuAvg, latestTps };
  }

  private calculateUptime(now: number, serverStartTime?: number) {
    // Ensure the date is in seconds (Plan might store it in milliseconds)
    const tpsDate = serverStartTime
      ? serverStartTime > 10000000000
        ? Math.floor(serverStartTime / 1000)
        : serverStartTime
      : now;
    const uptimeHours = Math.max(0, Math.floor((now - tpsDate) / 3600));
    const uptimeDays = Math.floor(uptimeHours / 24);
    const uptimeRemainingHours = uptimeHours % 24;
    return `${uptimeDays} days, ${uptimeRemainingHours} hours`;
  }

  async getPlayerStats(dto: GetPlayerStatsDto) {
    try {
      // Find the player by username or UUID
      const player = await this.planUserRepo.findOne({
        where: [{ name: dto.player }, { uuid: dto.player }],
      });

      if (!player) {
        return HttpError({ code: 'PLAYER_NOT_FOUND' });
      }

      // Get player sessions
      const sessions = await this.planSessionRepo.find({
        where: { user_id: player.id },
      });

      // Calculate total playtime
      const totalPlaytime = sessions.reduce((total, session) => {
        return total + (session.session_end - session.session_start);
      }, 0);

      // Get player kills
      const kills = await this.planKillRepo.count({
        where: { killer_uuid: player.uuid },
      });

      // Get player deaths
      const deaths = sessions.reduce((total, session) => {
        return total + session.deaths;
      }, 0);

      // Get player mob kills
      const mobKills = sessions.reduce((total, session) => {
        return total + session.mob_kills;
      }, 0);

      // Get last session for last seen time
      const lastSession =
        sessions.length > 0
          ? sessions.reduce((latest, session) => {
              return session.session_end > latest.session_end
                ? session
                : latest;
            }, sessions[0])
          : null;

      // Format the data for the frontend
      return {
        username: player.name,
        uuid: player.uuid,
        playtime: Math.floor(totalPlaytime / 3600), // Convert seconds to hours
        kills,
        deaths,
        kdr: deaths > 0 ? (kills / deaths).toFixed(2) : kills.toFixed(2),
        mobsKilled: mobKills,
        // Plan doesn't track these directly, so we'll use placeholder values
        blocksPlaced: 0,
        blocksBroken: 0,
        itemsCrafted: 0,
        distanceTraveled: 0,
        lastSeen: lastSession
          ? new Date(lastSession.session_end * 1000)
              .toISOString()
              .substring(0, 16)
              .replace('T', ' ')
          : new Date(player.registered * 1000)
              .toISOString()
              .substring(0, 16)
              .replace('T', ' '),
      };
    } catch (error) {
      console.error('Error fetching player stats:', error);
      return HttpError({ code: 'PLAYER_STATS_ERROR' });
    }
  }

  async getLeaderboard(dto: GetLeaderboardDto) {
    try {
      const limit = dto.limit || 10;
      let leaderboard = [];

      // Get all users
      const users = await this.planUserRepo.find();
      const userMap = new Map(users.map((user) => [user.id, user]));

      switch (dto.type) {
        case LeaderboardType.PLAYTIME:
          // Get all sessions
          const sessions = await this.planSessionRepo.find();

          // Calculate playtime for each user
          const playtimeMap = new Map<number, number>();
          sessions.forEach((session) => {
            const userId = session.user_id;
            const sessionTime = session.session_end - session.session_start;
            playtimeMap.set(
              userId,
              (playtimeMap.get(userId) || 0) + sessionTime,
            );
          });

          // Convert to array and sort
          leaderboard = Array.from(playtimeMap.entries())
            .map(([userId, playtime]) => {
              const user = userMap.get(userId);
              return {
                userId,
                username: user?.name || 'Unknown',
                uuid: user?.uuid || '',
                playtime,
              };
            })
            .sort((a, b) => b.playtime - a.playtime)
            .slice(0, limit);

          return leaderboard.map((entry) => ({
            username: entry.username,
            uuid: entry.uuid,
            value: Math.floor(entry.playtime / 3600), // Convert seconds to hours
          }));

        case LeaderboardType.KILLS:
          // Get all kills
          const kills = await this.planKillRepo.find();

          // Count kills for each user
          const killsMap = new Map<string, number>();
          kills.forEach((kill) => {
            killsMap.set(
              kill.killer_uuid,
              (killsMap.get(kill.killer_uuid) || 0) + 1,
            );
          });

          // Convert to array and sort
          leaderboard = Array.from(killsMap.entries())
            .map(([uuid, killCount]) => {
              const user = users.find((u) => u.uuid === uuid);
              return {
                username: user?.name || 'Unknown',
                uuid,
                kills: killCount,
              };
            })
            .sort((a, b) => b.kills - a.kills)
            .slice(0, limit);

          return leaderboard.map((entry) => ({
            username: entry.username,
            uuid: entry.uuid,
            value: entry.kills,
          }));

        case LeaderboardType.MOB_KILLS:
          // Get all sessions with mob kills
          const sessionsWithMobKills = await this.planSessionRepo.find();

          // Count mob kills for each user
          const mobKillsMap = new Map<number, number>();
          sessionsWithMobKills.forEach((session) => {
            mobKillsMap.set(
              session.user_id,
              (mobKillsMap.get(session.user_id) || 0) + session.mob_kills,
            );
          });

          // Convert to array and sort
          leaderboard = Array.from(mobKillsMap.entries())
            .map(([userId, mobKills]) => {
              const user = userMap.get(userId);
              return {
                username: user?.name || 'Unknown',
                uuid: user?.uuid || '',
                mobKills,
              };
            })
            .sort((a, b) => b.mobKills - a.mobKills)
            .slice(0, limit);

          return leaderboard.map((entry) => ({
            username: entry.username,
            uuid: entry.uuid,
            value: entry.mobKills,
          }));

        // Add other leaderboard types as needed

        default:
          return [];
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      return HttpError({ code: 'LEADERBOARD_ERROR' });
    }
  }

  async searchPlayers(query: string) {
    try {
      if (!query || query.length < 3) {
        return [];
      }

      const players = await this.planUserRepo.find({
        where: { name: Like(`%${query}%`) },
        take: 10,
      });

      return players.map((player) => ({
        username: player.name,
        uuid: player.uuid,
      }));
    } catch (error) {
      console.error('Error searching players:', error);
      return HttpError({ code: 'PLAYER_SEARCH_ERROR' });
    }
  }
}
