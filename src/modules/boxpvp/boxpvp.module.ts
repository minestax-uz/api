import { Module } from '@nestjs/common';
import { PermissionsModule } from './permissions/permissions.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [PermissionsModule, StatisticsModule],
  controllers: [],
  providers: [],
})
export class BoxpvpModule {}
