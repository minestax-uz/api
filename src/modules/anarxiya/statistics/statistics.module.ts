import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatisticsController } from './statistics.controller';
import { StatisticsService } from './statistics.service';
import {
  AnarxiyaPlanUser,
  AnarxiyaPlanServer,
  AnarxiyaPlanSession,
  AnarxiyaPlanKill,
  AnarxiyaPlanWorldTime,
  AnarxiyaPlanWorld,
  AnarxiyaPlanTps,
  AnarxiyaPlanPing,
  AnarxiyaPlanNickname,
  AnarxiyaPlanGeolocation,
  AnarxiyaPlanUserInfo,
} from 'src/common/database/entities/anarxiya/anarxiyaPlan.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AnarxiyaPlanUser,
      AnarxiyaPlanServer,
      AnarxiyaPlanSession,
      AnarxiyaPlanKill,
      AnarxiyaPlanWorldTime,
      AnarxiyaPlanWorld,
      AnarxiyaPlanTps,
      AnarxiyaPlanPing,
      AnarxiyaPlanNickname,
      AnarxiyaPlanGeolocation,
      AnarxiyaPlanUserInfo,
    ]),
  ],
  controllers: [StatisticsController],
  providers: [StatisticsService],
  exports: [StatisticsService],
})
export class StatisticsModule {}
