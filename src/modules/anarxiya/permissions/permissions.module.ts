import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PermissionsController } from './permissions.controller';
import { PermissionsService } from './permissions.service';
import {
  Group,
  GroupPermissions,
  Player,
  PlayerPermissions,
} from 'src/common/database/entities/anarxiya/anarxiyaRank.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Player,
      Group,
      GroupPermissions,
      PlayerPermissions,
    ]),
  ],
  controllers: [PermissionsController],
  providers: [PermissionsService],
})
export class PermissionsModule {}
