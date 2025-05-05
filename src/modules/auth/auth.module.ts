import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/common/database/entities/auth.entity';
import { PermissionsModule as AnarxiyaPermissions } from '../anarxiya/permissions/permissions.module';
import { PermissionsModule as SurvivalPermissions } from '../survival/permissions/permissions.module';
import { PermissionsModule as BoxpvpPermissions } from '../boxpvp/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth]),
    AnarxiyaPermissions,
    SurvivalPermissions,
    BoxpvpPermissions,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
