import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { HttpError } from 'src/common/exception/http.error';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Group,
  GroupPermissions,
  Player,
  PlayerPermissions,
} from 'src/common/database/entities/anarxiya/anarxiyaRank.entity';
import { BasePermissionsService } from 'src/common/service/basePermisson.service';

@Injectable()
export class PermissionsService extends BasePermissionsService {
  constructor(
    @InjectRepository(Group, 'anarxiya_rank') groupRepo: Repository<Group>,
    @InjectRepository(Player, 'anarxiya_rank') playersRepo: Repository<Player>,
    @InjectRepository(GroupPermissions, 'anarxiya_rank')
    groupPermissionsRepo: Repository<GroupPermissions>,
    @InjectRepository(PlayerPermissions, 'anarxiya_rank')
    playerPermissionsRepo: Repository<PlayerPermissions>,
  ) {
    super(groupRepo, playersRepo, groupPermissionsRepo, playerPermissionsRepo);
  }
}
