import {
  Controller,
  Post,
  Body,
  Patch,
  Delete,
  Get,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response/core.response';

import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { TokenService } from './token.service';

@ApiTags('token')
@Controller('anarxiya/token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}

  @Get('/:username')
  @DecoratorWrapper('get token')
  async get(@Param('username') username: string) {
    return CoreApiResponse.success(await this.tokenService.get(username));
  }

  @Post('/:username/:token')
  @DecoratorWrapper('add token')
  async add(
    @Param('username') username: string,
    @Param('token', ParseIntPipe) token: number,
  ) {
    return CoreApiResponse.success(
      await this.tokenService.add(username, token),
    );
  }

  @Patch('/:username/:token')
  @DecoratorWrapper('set token')
  async set(
    @Param('username') username: string,
    @Param('token', ParseIntPipe) token: number,
  ) {
    return CoreApiResponse.success(
      await this.tokenService.set(username, token),
    );
  }

  @Delete('/:username/:token')
  @DecoratorWrapper('remove token')
  async remove(
    @Param('username') username: string,
    @Param('token', ParseIntPipe) token: number,
  ) {
    return CoreApiResponse.success(
      await this.tokenService.remove(username, token),
    );
  }
}
