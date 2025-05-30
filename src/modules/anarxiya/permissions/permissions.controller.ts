import {
  Controller,
  Post,
  Patch,
  Delete,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response/core.response';

import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { AnarxiyaPermissionsService } from './permissions.service';
import { Role } from 'src/common/auth/roles/role.enum';

@ApiTags('permissions')
@Controller('anarxiya/permissions')
export class PermissionsController {
  constructor(
    private readonly permissionsService: AnarxiyaPermissionsService,
  ) {}

  @Get('/:username')
  @DecoratorWrapper('get permissions')
  async get(@Param('username') username: string) {
    return CoreApiResponse.success(
      await this.permissionsService.getPlayerPermissions(username),
    );
  }

  @Post('/:username/:permission')
  @DecoratorWrapper('add permission', true, [Role.ADMIN])
  async add(
    @Param('username') username: string,
    @Param('permission') permission: string,
  ) {
    return CoreApiResponse.success(
      await this.permissionsService.addPlayerPermission(username, permission),
    );
  }

  @Delete('/:username/:permission')
  @DecoratorWrapper('remove permission', true, [Role.ADMIN])
  async remove(
    @Param('username') username: string,
    @Param('permission') permission: string,
  ) {
    return CoreApiResponse.success(
      await this.permissionsService.removePlayerPermission(
        username,
        permission,
      ),
    );
  }
}
