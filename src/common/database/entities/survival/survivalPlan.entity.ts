import { Entity } from 'typeorm';
import {
  PlanUser,
  PlanServer,
  PlanSession,
  PlanKill,
  PlanWorld,
  PlanTps,
  PlanPing,
  PlanNickname,
  PlanGeolocation,
  PlanUserInfo,
} from '../plan';

@Entity({ database: 's13_stats', name: 'plan_users' })
export class SurvivalPlanUser extends PlanUser {}

@Entity({ database: 's13_stats', name: 'plan_servers' })
export class SurvivalPlanServer extends PlanServer {}

@Entity({ database: 's13_stats', name: 'plan_sessions' })
export class SurvivalPlanSession extends PlanSession {}

@Entity({ database: 's13_stats', name: 'plan_kills' })
export class SurvivalPlanKill extends PlanKill {}

@Entity({ database: 's13_stats', name: 'plan_worlds' })
export class SurvivalPlanWorld extends PlanWorld {}

@Entity({ database: 's13_stats', name: 'plan_tps' })
export class SurvivalPlanTps extends PlanTps {}

@Entity({ database: 's13_stats', name: 'plan_ping' })
export class SurvivalPlanPing extends PlanPing {}

@Entity({ database: 's13_stats', name: 'plan_nicknames' })
export class SurvivalPlanNickname extends PlanNickname {}

@Entity({ database: 's13_stats', name: 'plan_geolocations' })
export class SurvivalPlanGeolocation extends PlanGeolocation {}

@Entity({ database: 's13_stats', name: 'plan_user_info' })
export class SurvivalPlanUserInfo extends PlanUserInfo {}
