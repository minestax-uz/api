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

@Entity({ database: 's12_stats', name: 'plan_users' })
export class BoxpvpPlanUser extends PlanUser {}

@Entity({ database: 's12_stats', name: 'plan_servers' })
export class BoxpvpPlanServer extends PlanServer {}

@Entity({ database: 's12_stats', name: 'plan_sessions' })
export class BoxpvpPlanSession extends PlanSession {}

@Entity({ database: 's12_stats', name: 'plan_kills' })
export class BoxpvpPlanKill extends PlanKill {}

@Entity({ database: 's12_stats', name: 'plan_world_times' })
export class BoxpvpPlanWorldTime extends PlanWorldTime {}

@Entity({ database: 's12_stats', name: 'plan_worlds' })
export class BoxpvpPlanWorld extends PlanWorld {}

@Entity({ database: 's12_stats', name: 'plan_tps' })
export class BoxpvpPlanTps extends PlanTps {}

@Entity({ database: 's12_stats', name: 'plan_ping' })
export class BoxpvpPlanPing extends PlanPing {}

@Entity({ database: 's12_stats', name: 'plan_nicknames' })
export class BoxpvpPlanNickname extends PlanNickname {}

@Entity({ database: 's12_stats', name: 'plan_geolocations' })
export class BoxpvpPlanGeolocation extends PlanGeolocation {}

@Entity({ database: 's12_stats', name: 'plan_user_info' })
export class BoxpvpPlanUserInfo extends PlanUserInfo {}
