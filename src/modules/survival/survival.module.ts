import { Module } from '@nestjs/common';
import { PermissionsModule } from './permissions/permissions.module';
import { StatisticsModule } from './statistics/statistics.module';
import { SurvivalDatabaseModule } from './database/database.module';

@Module({
  imports: [SurvivalDatabaseModule, PermissionsModule, StatisticsModule],
  controllers: [],
  providers: [],
})
export class SurvivalModule {}
