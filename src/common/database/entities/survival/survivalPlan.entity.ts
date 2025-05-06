import { Entity } from 'typeorm';
import {
  PlanUser,
  PlanServer,
  PlanSession,
  PlanKill,
  PlanWorldTime,
  PlanWorld,
  PlanTps,
  PlanPing,
  PlanNickname,
  PlanGeolocation,
  PlanUserInfo,
} from '../plan';

@Entity({ database: '', name: 'plan_users' })
export class SurvivalPlanUser extends PlanUser {}

@Entity({ database: '', name: 'plan_servers' })
export class SurvivalPlanServer extends PlanServer {}

@Entity({ database: '', name: 'plan_sessions' })
export class SurvivalPlanSession extends PlanSession {}

@Entity({ database: '', name: 'plan_kills' })
export class SurvivalPlanKill extends PlanKill {}

@Entity({ database: '', name: 'plan_world_times' })
export class SurvivalPlanWorldTime extends PlanWorldTime {}

@Entity({ database: '', name: 'plan_worlds' })
export class SurvivalPlanWorld extends PlanWorld {}

@Entity({ database: '', name: 'plan_tps' })
export class SurvivalPlanTps extends PlanTps {}

@Entity({ database: '', name: 'plan_ping' })
export class SurvivalPlanPing extends PlanPing {}

@Entity({ database: '', name: 'plan_nicknames' })
export class SurvivalPlanNickname extends PlanNickname {}

@Entity({ database: '', name: 'plan_geolocations' })
export class SurvivalPlanGeolocation extends PlanGeolocation {}

@Entity({ database: '', name: 'plan_user_info' })
export class SurvivalPlanUserInfo extends PlanUserInfo {}
