import { Module } from '@nestjs/common';
import { AnarxiyaPermissionsModule } from '../anarxiya/permissions/permissions.module';
import { SurvivalPermissionsModule } from '../survival/permissions/permissions.module';
import { BoxpvpPermissionsModule } from '../boxpvp/permissions/permissions.module';

/**
 * This module aggregates all permission modules to avoid circular dependencies
 * when they are imported in other modules like AuthModule
 */
@Module({
  imports: [
    AnarxiyaPermissionsModule,
    SurvivalPermissionsModule,
    BoxpvpPermissionsModule,
  ],
  exports: [
    AnarxiyaPermissionsModule,
    SurvivalPermissionsModule,
    BoxpvpPermissionsModule,
  ],
})
export class PermissionsModule {}
