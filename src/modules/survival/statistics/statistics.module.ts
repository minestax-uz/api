import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { SurvivalDatabaseModule } from '../database/database.module';
import { ModuleAvailabilityModule } from 'src/common/service/module-availability.module';
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
    SurvivalDatabaseModule,
    ModuleAvailabilityModule,
    TypeOrmModule.forFeature(
      [
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
      ],
      'survival',
    ),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
