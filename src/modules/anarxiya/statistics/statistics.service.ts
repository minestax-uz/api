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
import { ModuleAvailabilityService } from 'src/common/service/module-availability.service';

@Injectable()
export class StatisticsService extends BaseStatisticsService {
  constructor(
    moduleAvailabilityService: ModuleAvailabilityService,
    @InjectRepository(AnarxiyaPlanUser, 'anarxiya')
    planUserRepo: Repository<AnarxiyaPlanUser>,
    @InjectRepository(AnarxiyaPlanServer, 'anarxiya')
    planServerRepo: Repository<AnarxiyaPlanServer>,
    @InjectRepository(AnarxiyaPlanSession, 'anarxiya')
    planSessionRepo: Repository<AnarxiyaPlanSession>,
    @InjectRepository(AnarxiyaPlanKill, 'anarxiya')
    planKillRepo: Repository<AnarxiyaPlanKill>,
    @InjectRepository(AnarxiyaPlanWorld, 'anarxiya')
    planWorldRepo: Repository<AnarxiyaPlanWorld>,
    @InjectRepository(AnarxiyaPlanTps, 'anarxiya')
    planTpsRepo: Repository<AnarxiyaPlanTps>,
    @InjectRepository(AnarxiyaPlanPing, 'anarxiya')
    planPingRepo: Repository<AnarxiyaPlanPing>,
    @InjectRepository(AnarxiyaPlanNickname, 'anarxiya')
    planNicknameRepo: Repository<AnarxiyaPlanNickname>,
    @InjectRepository(AnarxiyaPlanGeolocation, 'anarxiya')
    planGeolocationRepo: Repository<AnarxiyaPlanGeolocation>,
    @InjectRepository(AnarxiyaPlanUserInfo, 'anarxiya')
    planUserInfoRepo: Repository<AnarxiyaPlanUserInfo>,
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
