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

@Injectable()
export class StatisticsService extends BaseStatisticsService {
  constructor(
    @InjectRepository(BoxpvpPlanUser)
    planUserRepo: Repository<BoxpvpPlanUser>,
    @InjectRepository(BoxpvpPlanServer)
    planServerRepo: Repository<BoxpvpPlanServer>,
    @InjectRepository(BoxpvpPlanSession)
    planSessionRepo: Repository<BoxpvpPlanSession>,
    @InjectRepository(BoxpvpPlanKill)
    planKillRepo: Repository<BoxpvpPlanKill>,
    @InjectRepository(BoxpvpPlanWorld)
    planWorldRepo: Repository<BoxpvpPlanWorld>,
    @InjectRepository(BoxpvpPlanTps)
    planTpsRepo: Repository<BoxpvpPlanTps>,
    @InjectRepository(BoxpvpPlanPing)
    planPingRepo: Repository<BoxpvpPlanPing>,
    @InjectRepository(BoxpvpPlanNickname)
    planNicknameRepo: Repository<BoxpvpPlanNickname>,
    @InjectRepository(BoxpvpPlanGeolocation)
    planGeolocationRepo: Repository<BoxpvpPlanGeolocation>,
    @InjectRepository(BoxpvpPlanUserInfo)
    planUserInfoRepo: Repository<BoxpvpPlanUserInfo>,
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
