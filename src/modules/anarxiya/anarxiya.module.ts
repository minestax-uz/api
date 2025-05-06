import { Module } from '@nestjs/common';
import { TokenModule } from './token/token.module';
import { PermissionsModule } from './permissions/permissions.module';
import { StatisticsModule } from './statistics/statistics.module';

@Module({
  imports: [TokenModule, PermissionsModule, StatisticsModule],
  controllers: [],
  providers: [],
})
export class AnarxiyaModule {}
