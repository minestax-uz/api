import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Group,
  GroupPermissions,
  Player,
  PlayerPermissions,
} from 'src/common/database/entities/boxpvp/boxpvpRank.entity';
import { BasePermissionsService } from 'src/common/service/basePermisson.service';

@Injectable()
export class PermissionsService extends BasePermissionsService {
  constructor(
    @InjectRepository(Group, 'boxpvp_rank') groupRepo: Repository<Group>,
    @InjectRepository(Player, 'boxpvp_rank') playersRepo: Repository<Player>,
    @InjectRepository(GroupPermissions, 'boxpvp_rank')
    groupPermissionsRepo: Repository<GroupPermissions>,
    @InjectRepository(PlayerPermissions, 'boxpvp_rank')
    playerPermissionsRepo: Repository<PlayerPermissions>,
  ) {
    super(groupRepo, playersRepo, groupPermissionsRepo, playerPermissionsRepo);
  }
}
