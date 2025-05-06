import { Module } from '@nestjs/common';
import { ServerController } from './server.controller';
import { ServerService } from './server.service';
import { StatisticsModule as AnarxiyaStatisticsModule } from '../anarxiya/statistics/statistics.module';
import { StatisticsModule as SurvivalStatisticsModule } from '../survival/statistics/statistics.module';
import { StatisticsModule as BoxpvpStatisticsModule } from '../boxpvp/statistics/statistics.module';

@Module({
  imports: [
    AnarxiyaStatisticsModule,
    SurvivalStatisticsModule,
    BoxpvpStatisticsModule,
  ],
  controllers: [ServerController],
  providers: [ServerService],
})
export class ServerModule {}
