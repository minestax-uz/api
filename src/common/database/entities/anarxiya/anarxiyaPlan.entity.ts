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

@Entity({ database: 's32_stats', name: 'plan_users' })
export class AnarxiyaPlanUser extends PlanUser {}

@Entity({ database: 's32_stats', name: 'plan_servers' })
export class AnarxiyaPlanServer extends PlanServer {}

@Entity({ database: 's32_stats', name: 'plan_sessions' })
export class AnarxiyaPlanSession extends PlanSession {}

@Entity({ database: 's32_stats', name: 'plan_kills' })
export class AnarxiyaPlanKill extends PlanKill {}

@Entity({ database: 's32_stats', name: 'plan_worlds' })
export class AnarxiyaPlanWorld extends PlanWorld {}

@Entity({ database: 's32_stats', name: 'plan_tps' })
export class AnarxiyaPlanTps extends PlanTps {}

@Entity({ database: 's32_stats', name: 'plan_ping' })
export class AnarxiyaPlanPing extends PlanPing {}

@Entity({ database: 's32_stats', name: 'plan_nicknames' })
export class AnarxiyaPlanNickname extends PlanNickname {}

@Entity({ database: 's32_stats', name: 'plan_geolocations' })
export class AnarxiyaPlanGeolocation extends PlanGeolocation {}

@Entity({ database: 's32_stats', name: 'plan_user_info' })
export class AnarxiyaPlanUserInfo extends PlanUserInfo {}
