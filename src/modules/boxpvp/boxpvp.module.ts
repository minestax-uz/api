import { Module } from '@nestjs/common';
import { PermissionsModule } from './permissions/permissions.module';
import { StatisticsModule } from './statistics/statistics.module';
import { BoxpvpDatabaseModule } from './database/database.module';

@Module({
  imports: [BoxpvpDatabaseModule, PermissionsModule, StatisticsModule],
  controllers: [],
  providers: [],
})
export class BoxpvpModule {}
