import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import { AnarxiyaDatabaseModule } from '../database/database.module';
import { ModuleAvailabilityModule } from 'src/common/service/module-availability.module';
import {
  AnarxiyaPlanUser,
  AnarxiyaPlanServer,
  AnarxiyaPlanSession,
  AnarxiyaPlanKill,
  AnarxiyaPlanWorld,
  AnarxiyaPlanTps,
  AnarxiyaPlanPing,
  AnarxiyaPlanNickname,
  AnarxiyaPlanGeolocation,
  AnarxiyaPlanUserInfo,
} from 'src/common/database/entities/anarxiya/anarxiyaPlan.entity';

@Module({
  imports: [
    AnarxiyaDatabaseModule,
    ModuleAvailabilityModule,
    TypeOrmModule.forFeature(
      [
        AnarxiyaPlanUser,
        AnarxiyaPlanServer,
        AnarxiyaPlanSession,
        AnarxiyaPlanKill,
        AnarxiyaPlanWorld,
        AnarxiyaPlanTps,
        AnarxiyaPlanPing,
        AnarxiyaPlanNickname,
        AnarxiyaPlanGeolocation,
        AnarxiyaPlanUserInfo,
      ],
      'anarxiya',
    ),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
