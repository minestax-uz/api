import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response/core.response';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { StatisticsService } from './statistics.service';
import { GetServerStatsDto } from './dto/get-server-stats.dto';
import { GetPlayerStatsDto } from './dto/get-player-stats.dto';
import { GetLeaderboardDto } from './dto/get-leaderboard.dto';

@ApiTags('anarxiya-statistics')
@Controller('anarxiya/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('server')
  @DecoratorWrapper('get anarxiya server stats')
  async getServerStats(@Query() dto: GetServerStatsDto) {
    return CoreApiResponse.success(
      await this.statisticsService.getServerStats(dto),
    );
  }

  @Get('player')
  @DecoratorWrapper('get anarxiya player stats')
  async getPlayerStats(@Query() dto: GetPlayerStatsDto) {
    return CoreApiResponse.success(
      await this.statisticsService.getPlayerStats(dto),
    );
  }

  @Get('leaderboard')
  @DecoratorWrapper('get anarxiya leaderboard')
  async getLeaderboard(@Query() dto: GetLeaderboardDto) {
    return CoreApiResponse.success(
      await this.statisticsService.getLeaderboard(dto),
    );
  }

  @Get('search/:query')
  @DecoratorWrapper('search anarxiya players')
  async searchPlayers(@Param('query') query: string) {
    return CoreApiResponse.success(
      await this.statisticsService.searchPlayers(query),
    );
  }
}
