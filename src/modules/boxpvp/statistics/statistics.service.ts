import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BoxpvpPlanUser,
  BoxpvpPlanServer,
  BoxpvpPlanSession,
  BoxpvpPlanKill,
  BoxpvpPlanWorld,
  BoxpvpPlanTps,
  BoxpvpPlanPing,
  BoxpvpPlanNickname,
  BoxpvpPlanGeolocation,
  BoxpvpPlanUserInfo,
} from 'src/common/database/entities/boxpvp/boxpvpPlan.entity';
import { BaseStatisticsService } from 'src/common/service/baseStatistics.service';
import { ModuleAvailabilityService } from 'src/common/service/module-availability.service';

@Injectable()
export class StatisticsService extends BaseStatisticsService {
  constructor(
    moduleAvailabilityService: ModuleAvailabilityService,
    @InjectRepository(BoxpvpPlanUser, 'boxpvp')
    planUserRepo: Repository<BoxpvpPlanUser>,
    @InjectRepository(BoxpvpPlanServer, 'boxpvp')
    planServerRepo: Repository<BoxpvpPlanServer>,
    @InjectRepository(BoxpvpPlanSession, 'boxpvp')
    planSessionRepo: Repository<BoxpvpPlanSession>,
    @InjectRepository(BoxpvpPlanKill, 'boxpvp')
    planKillRepo: Repository<BoxpvpPlanKill>,
    @InjectRepository(BoxpvpPlanWorld, 'boxpvp')
    planWorldRepo: Repository<BoxpvpPlanWorld>,
    @InjectRepository(BoxpvpPlanTps, 'boxpvp')
    planTpsRepo: Repository<BoxpvpPlanTps>,
    @InjectRepository(BoxpvpPlanPing, 'boxpvp')
    planPingRepo: Repository<BoxpvpPlanPing>,
    @InjectRepository(BoxpvpPlanNickname, 'boxpvp')
    planNicknameRepo: Repository<BoxpvpPlanNickname>,
    @InjectRepository(BoxpvpPlanGeolocation, 'boxpvp')
    planGeolocationRepo: Repository<BoxpvpPlanGeolocation>,
    @InjectRepository(BoxpvpPlanUserInfo, 'boxpvp')
    planUserInfoRepo: Repository<BoxpvpPlanUserInfo>,
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
