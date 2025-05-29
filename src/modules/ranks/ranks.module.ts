import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RankController } from './ranks.controller';
import { RankService } from './ranks.service';
import { Rank } from '../../common/database/entities/ranks.entity';
import { RankPurchase } from '../../common/database/entities/rank-purchase.entity';
import { AnarxiyaPermissionsModule } from '../anarxiya/permissions/permissions.module';
import { SurvivalPermissionsModule } from '../survival/permissions/permissions.module';
import { BoxpvpPermissionsModule } from '../boxpvp/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Rank, RankPurchase]),
    AnarxiyaPermissionsModule,
    SurvivalPermissionsModule,
    BoxpvpPermissionsModule,
  ],
  controllers: [RankController],
  providers: [RankService],
  exports: [RankService],
})
export class RankModule {}
