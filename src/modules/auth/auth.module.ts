import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/common/database/entities/auth.entity';
import { AnarxiyaPermissionsModule as AnarxiyaPermissions } from '../anarxiya/permissions/permissions.module';
import { SurvivalPermissionsModule as SurvivalPermissions } from '../survival/permissions/permissions.module';
import { BoxpvpPermissionsModule as BoxpvpPermissions } from '../boxpvp/permissions/permissions.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth], 'default'),
    AnarxiyaPermissions,
    SurvivalPermissions,
    BoxpvpPermissions,
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
