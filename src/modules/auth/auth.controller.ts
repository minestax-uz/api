import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CoreApiResponse } from 'src/common/response/core.response';
import { LoginauthDto } from './dto/login-auth.dto';
import { RefreshauthDto } from './dto/refresh-auth.dto';
import { DecoratorWrapper } from 'src/common/auth/decorator.auth';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @DecoratorWrapper('auth login')
  async login(@Body() dto: LoginauthDto) {
    return CoreApiResponse.success(await this.authService.login(dto));
  }

  @Post('refresh')
  @DecoratorWrapper('auth refresh token')
  async refresh(@Body() dto: RefreshauthDto) {
    return CoreApiResponse.success(await this.authService.refresh(dto));
  }
}
