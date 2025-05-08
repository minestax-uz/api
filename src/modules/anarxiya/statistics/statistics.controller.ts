import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response/core.response';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { StatisticsService } from './statistics.service';

@ApiTags('anarxiya-statistics')
@Controller('anarxiya/statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('server')
  @DecoratorWrapper('get Anarxiya server stats')
  async getFullServerStats() {
    return CoreApiResponse.success(
      await this.statisticsService.getFullServerStats(),
    );
  }

  @Get()
  @DecoratorWrapper('get Anarxiya server status')
  async getServerStats(@Query('range', ParseIntPipe) range: number = 24) {
    return CoreApiResponse.success(
      await this.statisticsService.getServerStats(range),
    );
  }

  @Get('player/:username')
  @DecoratorWrapper('get Anarxiya player stats')
  async getPlayerStats(
    @Param('username') username: string,
    @Query('range') range: number = 24,
  ) {
    return CoreApiResponse.success(
      await this.statisticsService.getPlayerStats(username, range),
    );
  }
}
