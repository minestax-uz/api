import { Module } from '@nestjs/common';
import { TokenModule } from './token/token.module';
import { PermissionsModule } from './permissions/permissions.module';

@Module({
  imports: [TokenModule, PermissionsModule],
  controllers: [],
  providers: [],
})
export class AnarxiyaModule {}
