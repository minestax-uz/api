import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from './permissions.controller';
import { AnarxiyaPermissionsService } from './permissions.service';
import {
  Group,
  GroupPermissions,
  Player,
  PlayerPermissions,
} from 'src/common/database/entities/anarxiya/anarxiyaRank.entity';
import { AnarxiyaDatabaseModule } from '../database/database.module';

@Module({
  imports: [
    AnarxiyaDatabaseModule,
    TypeOrmModule.forFeature(
      [Player, Group, GroupPermissions, PlayerPermissions],
      'anarxiya_rank', // Specify the connection name for the rank database
    ),
  ],
  controllers: [PermissionsController],
  providers: [AnarxiyaPermissionsService],
  exports: [AnarxiyaPermissionsService],
})
export class AnarxiyaPermissionsModule {}
