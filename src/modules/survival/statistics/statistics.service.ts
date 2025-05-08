import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  SurvivalPlanUser,
  SurvivalPlanServer,
  SurvivalPlanSession,
  SurvivalPlanKill,
  SurvivalPlanWorld,
  SurvivalPlanTps,
  SurvivalPlanPing,
  SurvivalPlanNickname,
  SurvivalPlanGeolocation,
  SurvivalPlanUserInfo,
} from 'src/common/database/entities/survival/survivalPlan.entity';
import { BaseStatisticsService } from 'src/common/service/baseStatistics.service';

@Injectable()
export class StatisticsService extends BaseStatisticsService {
  constructor(
    @InjectRepository(SurvivalPlanUser)
    planUserRepo: Repository<SurvivalPlanUser>,
    @InjectRepository(SurvivalPlanServer)
    planServerRepo: Repository<SurvivalPlanServer>,
    @InjectRepository(SurvivalPlanSession)
    planSessionRepo: Repository<SurvivalPlanSession>,
    @InjectRepository(SurvivalPlanKill)
    planKillRepo: Repository<SurvivalPlanKill>,
    @InjectRepository(SurvivalPlanWorld)
    planWorldRepo: Repository<SurvivalPlanWorld>,
    @InjectRepository(SurvivalPlanTps)
    planTpsRepo: Repository<SurvivalPlanTps>,
    @InjectRepository(SurvivalPlanPing)
    planPingRepo: Repository<SurvivalPlanPing>,
    @InjectRepository(SurvivalPlanNickname)
    planNicknameRepo: Repository<SurvivalPlanNickname>,
    @InjectRepository(SurvivalPlanGeolocation)
    planGeolocationRepo: Repository<SurvivalPlanGeolocation>,
    @InjectRepository(SurvivalPlanUserInfo)
    planUserInfoRepo: Repository<SurvivalPlanUserInfo>,
  ) {
    super(
      planUserRepo,
      planServerRepo,
      planSessionRepo,
      planKillRepo,
      planWorldRepo,
      planTpsRepo,
      planPingRepo,
      planNicknameRepo,
      planGeolocationRepo,
      planUserInfoRepo,
    );
  }
}
