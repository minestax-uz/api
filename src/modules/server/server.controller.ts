import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response/core.response';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { ServerService } from './server.service';

@ApiTags('server')
@Controller('server')
export class ServerController {
  constructor(private readonly serverService: ServerService) {}

  @Get('stats')
  @DecoratorWrapper('get server stats')
  async getStats() {
    return CoreApiResponse.success(await this.serverService.getStats());
  }

  @Get('players')
  @DecoratorWrapper('get all players')
  async getPlayers(@Query('search') search: string) {
    return CoreApiResponse.success(await this.serverService.getPlayers(search));
  }
}
