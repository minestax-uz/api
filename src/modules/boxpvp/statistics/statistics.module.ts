import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
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

@Module({
  imports: [
    TypeOrmModule.forFeature([
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
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
