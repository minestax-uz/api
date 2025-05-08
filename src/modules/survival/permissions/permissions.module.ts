import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import {
  Group,
  GroupPermissions,
  Player,
  PlayerPermissions,
} from 'src/common/database/entities/survival/survivalRank.entity';
import { SurvivalDatabaseModule } from '../database/database.module';

@Module({
  imports: [
    SurvivalDatabaseModule,
    TypeOrmModule.forFeature([
      Player,
      Group,
      GroupPermissions,
      PlayerPermissions,
    ]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
  exports: [PermissionsService],
})
export class PermissionsModule {}
