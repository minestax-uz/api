import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  AnarxiyaPlanUser,
  AnarxiyaPlanServer,
  AnarxiyaPlanSession,
  AnarxiyaPlanKill,
  AnarxiyaPlanWorld,
  AnarxiyaPlanTps,
  AnarxiyaPlanPing,
  AnarxiyaPlanNickname,
  AnarxiyaPlanGeolocation,
  AnarxiyaPlanUserInfo,
} from 'src/common/database/entities/anarxiya/anarxiyaPlan.entity';
import { BaseStatisticsService } from 'src/common/service/baseStatistics.service';

@Injectable()
export class StatisticsService extends BaseStatisticsService {
  constructor(
    @InjectRepository(AnarxiyaPlanUser)
    planUserRepo: Repository<AnarxiyaPlanUser>,
    @InjectRepository(AnarxiyaPlanServer)
    planServerRepo: Repository<AnarxiyaPlanServer>,
    @InjectRepository(AnarxiyaPlanSession)
    planSessionRepo: Repository<AnarxiyaPlanSession>,
    @InjectRepository(AnarxiyaPlanKill)
    planKillRepo: Repository<AnarxiyaPlanKill>,
    @InjectRepository(AnarxiyaPlanWorld)
    planWorldRepo: Repository<AnarxiyaPlanWorld>,
    @InjectRepository(AnarxiyaPlanTps)
    planTpsRepo: Repository<AnarxiyaPlanTps>,
    @InjectRepository(AnarxiyaPlanPing)
    planPingRepo: Repository<AnarxiyaPlanPing>,
    @InjectRepository(AnarxiyaPlanNickname)
    planNicknameRepo: Repository<AnarxiyaPlanNickname>,
    @InjectRepository(AnarxiyaPlanGeolocation)
    planGeolocationRepo: Repository<AnarxiyaPlanGeolocation>,
    @InjectRepository(AnarxiyaPlanUserInfo)
    planUserInfoRepo: Repository<AnarxiyaPlanUserInfo>,
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
