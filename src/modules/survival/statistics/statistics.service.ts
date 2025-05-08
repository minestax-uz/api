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
import { ModuleAvailabilityService } from 'src/common/service/module-availability.service';

@Injectable()
export class StatisticsService extends BaseStatisticsService {
  constructor(
    moduleAvailabilityService: ModuleAvailabilityService,
    @InjectRepository(SurvivalPlanUser, 'survival')
    planUserRepo: Repository<SurvivalPlanUser>,
    @InjectRepository(SurvivalPlanServer, 'survival')
    planServerRepo: Repository<SurvivalPlanServer>,
    @InjectRepository(SurvivalPlanSession, 'survival')
    planSessionRepo: Repository<SurvivalPlanSession>,
    @InjectRepository(SurvivalPlanKill, 'survival')
    planKillRepo: Repository<SurvivalPlanKill>,
    @InjectRepository(SurvivalPlanWorld, 'survival')
    planWorldRepo: Repository<SurvivalPlanWorld>,
    @InjectRepository(SurvivalPlanTps, 'survival')
    planTpsRepo: Repository<SurvivalPlanTps>,
    @InjectRepository(SurvivalPlanPing, 'survival')
    planPingRepo: Repository<SurvivalPlanPing>,
    @InjectRepository(SurvivalPlanNickname, 'survival')
    planNicknameRepo: Repository<SurvivalPlanNickname>,
    @InjectRepository(SurvivalPlanGeolocation, 'survival')
    planGeolocationRepo: Repository<SurvivalPlanGeolocation>,
    @InjectRepository(SurvivalPlanUserInfo, 'survival')
    planUserInfoRepo: Repository<SurvivalPlanUserInfo>,
  ) {
    super(
      moduleAvailabilityService,
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
