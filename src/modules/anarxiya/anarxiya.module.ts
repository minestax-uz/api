import { Module } from '@nestjs/common';
import { TokenModule } from './token/token.module';
import { AnarxiyaPermissionsModule } from './permissions/permissions.module';
import { StatisticsModule } from './statistics/statistics.module';
import { AnarxiyaDatabaseModule } from './database/database.module';

@Module({
  imports: [
    AnarxiyaDatabaseModule,
    TokenModule,
    AnarxiyaPermissionsModule,
    StatisticsModule,
  ],
  controllers: [],
  providers: [],
})
export class AnarxiyaModule {}
