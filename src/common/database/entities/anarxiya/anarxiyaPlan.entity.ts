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
export class AnarxiyaPlanUser extends PlanUser {}

@Entity({ database: '', name: 'plan_servers' })
export class AnarxiyaPlanServer extends PlanServer {}

@Entity({ database: '', name: 'plan_sessions' })
export class AnarxiyaPlanSession extends PlanSession {}

@Entity({ database: '', name: 'plan_kills' })
export class AnarxiyaPlanKill extends PlanKill {}

@Entity({ database: '', name: 'plan_world_times' })
export class AnarxiyaPlanWorldTime extends PlanWorldTime {}

@Entity({ database: '', name: 'plan_worlds' })
export class AnarxiyaPlanWorld extends PlanWorld {}

@Entity({ database: '', name: 'plan_tps' })
export class AnarxiyaPlanTps extends PlanTps {}

@Entity({ database: '', name: 'plan_ping' })
export class AnarxiyaPlanPing extends PlanPing {}

@Entity({ database: '', name: 'plan_nicknames' })
export class AnarxiyaPlanNickname extends PlanNickname {}

@Entity({ database: '', name: 'plan_geolocations' })
export class AnarxiyaPlanGeolocation extends PlanGeolocation {}

@Entity({ database: '', name: 'plan_user_info' })
export class AnarxiyaPlanUserInfo extends PlanUserInfo {}
