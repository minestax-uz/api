import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { BoxpvpDatabaseModule } from '../database/database.module';
import { ModuleAvailabilityModule } from 'src/common/service/module-availability.module';
import {
  BoxpvpPlanUser,
  BoxpvpPlanServer,
  BoxpvpPlanSession,
  BoxpvpPlanKill,
  BoxpvpPlanWorld,
  BoxpvpPlanTps,
  BoxpvpPlanPing,
  BoxpvpPlanNickname,
  BoxpvpPlanGeolocation,
  BoxpvpPlanUserInfo,
} from 'src/common/database/entities/boxpvp/boxpvpPlan.entity';

@Module({
  imports: [
    BoxpvpDatabaseModule,
    ModuleAvailabilityModule,
    TypeOrmModule.forFeature(
      [
        BoxpvpPlanUser,
        BoxpvpPlanServer,
        BoxpvpPlanSession,
        BoxpvpPlanKill,
        BoxpvpPlanWorld,
        BoxpvpPlanTps,
        BoxpvpPlanPing,
        BoxpvpPlanNickname,
        BoxpvpPlanGeolocation,
        BoxpvpPlanUserInfo,
      ],
      'boxpvp',
    ),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
