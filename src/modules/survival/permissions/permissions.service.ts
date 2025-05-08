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
    @InjectRepository(Group) groupRepo: Repository<Group>,
    @InjectRepository(Player) playersRepo: Repository<Player>,
    @InjectRepository(GroupPermissions)
    groupPermissionsRepo: Repository<GroupPermissions>,
    @InjectRepository(PlayerPermissions)
    playerPermissionsRepo: Repository<PlayerPermissions>,
  ) {
    super(groupRepo, playersRepo, groupPermissionsRepo, playerPermissionsRepo);
  }
}
