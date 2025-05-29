import { Controller, Get, Post, Body, Query, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from '../../common/response/core.response';
import { RankService } from './ranks.service';
import { DecoratorWrapper } from '../../common/auth/decorator.auth';
import { Role } from '../../common/auth/roles/role.enum';

@ApiTags('ranks')
@Controller('ranks')
export class RankController {
  constructor(private readonly rankService: RankService) {}

  @Get()
  @DecoratorWrapper('get ranks')
  async getRanks(
    @Query('serverType') serverType?: 'anarxiya' | 'survival' | 'boxpvp',
  ) {
    return CoreApiResponse.success(await this.rankService.getRanks(serverType));
  }

  @Get(':id')
  @DecoratorWrapper('get rank')
  async getRank(@Param('id') id: number) {
    return CoreApiResponse.success(await this.rankService.getRank(id));
  }

  @Post('purchase/:rankId')
  @DecoratorWrapper('purchase rank', true, [Role.USER])
  async purchaseRank(
    @Param('rankId') rankId: number,
    @Body('username') username: string,
  ) {
    return CoreApiResponse.success(
      await this.rankService.initiateRankPurchase(username, rankId),
    );
  }

  @Post('webhook/clickpay')
  async handleWebhook(@Body() payload: any) {
    return CoreApiResponse.success(
      await this.rankService.handlePaymentWebhook(payload),
    );
  }
}
