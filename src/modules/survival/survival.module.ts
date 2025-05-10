import { Module } from '@nestjs/common';
import { SurvivalPermissionsModule } from './permissions/permissions.module';
import { StatisticsModule } from './statistics/statistics.module';
import { SurvivalDatabaseModule } from './database/database.module';

@Module({
  imports: [
    SurvivalDatabaseModule,
    SurvivalPermissionsModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class SurvivalModule {}
