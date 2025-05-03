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
import { PermissionsService } from './permissions.service';

@ApiTags('permissions')
@Controller('boxpvp/permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Get('/:username')
  @DecoratorWrapper('get permissions')
  async get(@Param('username') username: string) {
    return CoreApiResponse.success(
      await this.permissionsService.getPlayerPermissions(username),
    );
  }

  @Post('/:username/:permission')
  @DecoratorWrapper('add permission')
  async add(
    @Param('username') username: string,
    @Param('permission') permission: string,
  ) {
    return CoreApiResponse.success(
      await this.permissionsService.addPlayerPermission(username, permission),
    );
  }

  @Delete('/:username/:permission')
  @DecoratorWrapper('remove permission')
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
