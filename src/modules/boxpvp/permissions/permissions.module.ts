import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from './permissions.controller';
import { BoxpvpPermissionsService } from './permissions.service';
import {
  Group,
  GroupPermissions,
  Player,
  PlayerPermissions,
} from 'src/common/database/entities/boxpvp/boxpvpRank.entity';
import { BoxpvpDatabaseModule } from '../database/database.module';

@Module({
  imports: [
    BoxpvpDatabaseModule,
    TypeOrmModule.forFeature(
      [Player, Group, GroupPermissions, PlayerPermissions],
      'boxpvp_rank', // Specify the connection name for the rank database
    ),
  ],
  controllers: [PermissionsController],
  providers: [BoxpvpPermissionsService],
  exports: [BoxpvpPermissionsService],
})
export class BoxpvpPermissionsModule {}
