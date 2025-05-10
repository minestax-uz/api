import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/common/database/entities/auth.entity';
import { AnarxiyaPermissionsModule } from '../anarxiya/permissions/permissions.module';
import { SurvivalPermissionsModule } from '../survival/permissions/permissions.module';
import { BoxpvpPermissionsModule } from '../boxpvp/permissions/permissions.module';
import { PermissionsWrapperService } from './permissions.wrapper.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Auth], 'default'),
    AnarxiyaPermissionsModule,
    SurvivalPermissionsModule,
    BoxpvpPermissionsModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, PermissionsWrapperService],
})
export class AuthModule {}
