import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { HttpError } from 'src/common/exception/http.error';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Group,
  GroupPermissions,
  Player,
  PlayerPermissions,
} from 'src/common/database/entities/boxpvp/boxpvpRank.entity';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectRepository(Group) private groupRepo: Repository<Group>,
    @InjectRepository(Player) private playersRepo: Repository<Player>,
    @InjectRepository(GroupPermissions)
    private groupPermissionsRepo: Repository<GroupPermissions>,
    @InjectRepository(PlayerPermissions)
    private playerPermissionsRepo: Repository<PlayerPermissions>,
  ) {}

  async getPlayerPermissions(username: string): Promise<string[]> {
    const player = await this.playersRepo.findOne({
      where: { username },
    });
    if (!player) throw new HttpError({ code: 'PLAYER_NOT_FOUND' });

    const playerPermissions = await this.playerPermissionsRepo.find({
      where: { uuid: player.uuid },
    });

    const playerPerms = playerPermissions.map((p) => p.permission);
    const groupPerms: string[] = [];

    for (const perm of playerPerms) {
      if (perm.startsWith('group.')) {
        const groupName = perm.substring(6);
        const group = await this.groupPermissionsRepo.find({
          where: { name: groupName },
        });
        if (group) {
          groupPerms.push(...group.map((g) => g.permission));
        }
      }
    }

    return [...new Set([...playerPerms, ...groupPerms])];
  }

  async addPlayerPermission(username: string, permission: string) {
    const player = await this.playersRepo.findOne({ where: { username } });
    if (!player) throw new HttpError({ code: 'PLAYER_NOT_FOUND' });

    const newPermission = this.playerPermissionsRepo.create({
      uuid: player.uuid,
      permission,
      value: true,
      contexts: '{}',
      expiry: 0,
      server: 'global',
      world: 'global',
    });
    await this.playerPermissionsRepo.save(newPermission);
  }

  async removePlayerPermission(
    username: string,
    permission: string,
  ): Promise<void> {
    const player = await this.playersRepo.findOne({ where: { username } });
    if (!player) throw new HttpError({ code: 'PLAYER_NOT_FOUND' });

    await this.playerPermissionsRepo.delete({
      uuid: player.uuid,
      permission,
    });
  }
}
