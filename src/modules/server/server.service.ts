import { Injectable } from '@nestjs/common';
import { StatisticsService as AnarxiyaStatisticsService } from '../anarxiya/statistics/statistics.service';
import { StatisticsService as SurvivalStatisticsService } from '../survival/statistics/statistics.service';
import { StatisticsService as BoxpvpStatisticsService } from '../boxpvp/statistics/statistics.service';

@Injectable()
export class ServerService {
  constructor(
    private readonly anarxiyaStatsService: AnarxiyaStatisticsService,
    private readonly survivalStatsService: SurvivalStatisticsService,
    private readonly boxpvpStatsService: BoxpvpStatisticsService,
  ) {}

  async getStats() {
    try {
      // Get stats from all servers
      const [anarxiyaStatsResult, survivalStatsResult, boxpvpStatsResult] =
        await Promise.all([
          this.anarxiyaStatsService.getServerStats({}),
          this.survivalStatsService.getServerStats({}),
          this.boxpvpStatsService.getServerStats({}),
        ]);

      // Create default stats objects in case any of the services return void
      const defaultStats = {
        onlinePlayers: 0,
        uptime: '0 days, 0 hours',
        tps: 20,
        cpuUsage: 0,
        memoryUsage: 0,
        playerActivity: [],
      };

      // Use the results or default values if they're void
      const anarxiyaStats = anarxiyaStatsResult || defaultStats;
      const survivalStats = survivalStatsResult || defaultStats;
      const boxpvpStats = boxpvpStatsResult || defaultStats;

      // Calculate total online players
      const onlinePlayers =
        anarxiyaStats.onlinePlayers +
        survivalStats.onlinePlayers +
        boxpvpStats.onlinePlayers;

      // Calculate average TPS
      const tps = (anarxiyaStats.tps + survivalStats.tps + boxpvpStats.tps) / 3;

      // Calculate total CPU usage
      const cpuUsage =
        (anarxiyaStats.cpuUsage +
          survivalStats.cpuUsage +
          boxpvpStats.cpuUsage) /
        3;

      // Calculate total memory usage
      const memoryUsage =
        anarxiyaStats.memoryUsage +
        survivalStats.memoryUsage +
        boxpvpStats.memoryUsage;

      // Use the player activity from anarxiya or create an empty array
      const basePlayerActivity = anarxiyaStats.playerActivity || [];

      // Combine player activity data
      // This is a simplified approach - in a real implementation, you'd need to
      // merge the time series data more carefully
      const playerActivity = basePlayerActivity.map((entry, index) => {
        return {
          time: entry.time,
          count:
            entry.count +
            ((survivalStats.playerActivity || [])[index]?.count || 0) +
            ((boxpvpStats.playerActivity || [])[index]?.count || 0),
        };
      });

      // Return combined stats
      return {
        onlinePlayers,
        uptime: 'Combined servers', // This doesn't make sense to combine
        tps,
        cpuUsage,
        memoryUsage,
        playerActivity,
        servers: {
          anarxiya: anarxiyaStats,
          survival: survivalStats,
          boxpvp: boxpvpStats,
        },
      };
    } catch (error) {
      console.error('Error fetching combined server stats:', error);
      // Return default values if there's an error
      return {
        onlinePlayers: 0,
        uptime: '0 days, 0 hours',
        tps: 20,
        cpuUsage: 0,
        memoryUsage: 0,
        playerActivity: [],
        servers: {
          anarxiya: {},
          survival: {},
          boxpvp: {},
        },
      };
    }
  }

  async getPlayers(search: string) {
    try {
      // Get players from all servers
      const [
        anarxiyaPlayersResult,
        survivalPlayersResult,
        boxpvpPlayersResult,
      ] = await Promise.all([
        this.anarxiyaStatsService.searchPlayers(search || ''),
        this.survivalStatsService.searchPlayers(search || ''),
        this.boxpvpStatsService.searchPlayers(search || ''),
      ]);

      // Use the results or empty arrays if they're void
      const anarxiyaPlayers = anarxiyaPlayersResult || [];
      const survivalPlayers = survivalPlayersResult || [];
      const boxpvpPlayers = boxpvpPlayersResult || [];

      // Combine and deduplicate players by UUID
      const playerMap = new Map();

      [...anarxiyaPlayers, ...survivalPlayers, ...boxpvpPlayers].forEach(
        (player) => {
          if (!playerMap.has(player.uuid)) {
            playerMap.set(player.uuid, player);
          }
        },
      );

      return Array.from(playerMap.values());
    } catch (error) {
      console.error('Error fetching players:', error);
      return [];
    }
  }
}
