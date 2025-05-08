import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import {
  SurvivalPlanUser,
  SurvivalPlanServer,
  SurvivalPlanSession,
  SurvivalPlanKill,
  SurvivalPlanWorld,
  SurvivalPlanTps,
  SurvivalPlanPing,
  SurvivalPlanNickname,
  SurvivalPlanGeolocation,
  SurvivalPlanUserInfo,
} from 'src/common/database/entities/survival/survivalPlan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SurvivalPlanUser,
      SurvivalPlanServer,
      SurvivalPlanSession,
      SurvivalPlanKill,
      SurvivalPlanWorld,
      SurvivalPlanTps,
      SurvivalPlanPing,
      SurvivalPlanNickname,
      SurvivalPlanGeolocation,
      SurvivalPlanUserInfo,
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
