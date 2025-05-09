import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Group,
  GroupPermissions,
  Player,
  PlayerPermissions,
} from 'src/common/database/entities/survival/survivalRank.entity';
import { BasePermissionsService } from 'src/common/service/basePermisson.service';

@Injectable()
export class PermissionsService extends BasePermissionsService {
  constructor(
    @InjectRepository(Group, 'survival_rank') groupRepo: Repository<Group>,
    @InjectRepository(Player, 'survival_rank') playersRepo: Repository<Player>,
    @InjectRepository(GroupPermissions, 'survival_rank')
    groupPermissionsRepo: Repository<GroupPermissions>,
    @InjectRepository(PlayerPermissions, 'survival_rank')
    playerPermissionsRepo: Repository<PlayerPermissions>,
  ) {
    super(groupRepo, playersRepo, groupPermissionsRepo, playerPermissionsRepo);
  }
}
