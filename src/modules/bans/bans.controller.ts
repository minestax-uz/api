import { Controller, Body, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response/core.response';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { BansService } from './bans.service';
import { GetBansDto } from './dto/get-bans.dto';

@ApiTags('bans')
@Controller('bans')
export class BansController {
  constructor(private readonly bansService: BansService) {}

  @Get()
  @DecoratorWrapper('get bans')
  async get(@Query() dto: GetBansDto) {
    return CoreApiResponse.success(await this.bansService.get(dto));
  }
}
