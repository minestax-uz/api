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
import { AnarxiyaDatabaseModule } from '../database/database.module';

@Module({
  imports: [
    AnarxiyaDatabaseModule,
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
