import { Entity } from 'typeorm';
import {
  Player as RootPlayer,
  Group as RootGroup,
  GroupPermissions as RootGroupPermissions,
  PlayerPermissions as RootPlayerPermissions,
} from '../root/permissons.entity';

@Entity({ database: 's12_rank', name: 'luckperms_players' })
export class Player extends RootPlayer {}

@Entity({ database: 's12_rank', name: 'luckperms_groups' })
export class Group extends RootGroup {}

@Entity({ database: 's12_rank', name: 'luckperms_group_permissions' })
export class GroupPermissions extends RootGroupPermissions {}

@Entity({ database: 's12_rank', name: 'luckperms_user_permissions' })
export class PlayerPermissions extends RootPlayerPermissions {}
