import { Module } from '@nestjs/common';
import { BoxpvpPermissionsModule } from './permissions/permissions.module';
import { StatisticsModule } from './statistics/statistics.module';
import { BoxpvpDatabaseModule } from './database/database.module';

@Module({
  imports: [BoxpvpDatabaseModule, BoxpvpPermissionsModule, StatisticsModule],
  controllers: [],
  providers: [],
})
export class BoxpvpModule {}
