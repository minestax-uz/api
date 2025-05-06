import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { HttpError } from 'src/common/exception/http.error';
import { LoginAuthDto } from './dto/login-auth.dto';
import { env } from 'src/common/config';
import { RefreshAuthDto } from './dto/refresh-auth.dto';
import { Role } from 'src/common/auth/roles/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/common/database/entities/auth.entity';
import { sign, verify } from 'jsonwebtoken';
import { compare } from 'src/common/utils/hash/hashing.utils';
import { PermissionsService as BoxpvpRankService } from 'src/modules/boxpvp/permissions/permissions.service';
import { PermissionsService as AnarxiyaRankService } from 'src/modules/anarxiya/permissions/permissions.service';
import { PermissionsService as SurvivalRankService } from 'src/modules/survival/permissions/permissions.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    private boxpvpRankService: BoxpvpRankService,
    private anarxiyaRankService: AnarxiyaRankService,
    private survivalRankService: SurvivalRankService,
  ) {}

  async getPlayerRole(username: string): Promise<'admin' | 'moder' | 'user'> {
    let permissions = [
      await this.boxpvpRankService.getPlayerRole(username),
      await this.anarxiyaRankService.getPlayerRole(username),
      await this.survivalRankService.getPlayerRole(username),
    ];

    if (permissions.includes('admin')) return 'admin';
    if (permissions.includes('moder')) return 'moder';
    return 'user';
  }

  async get(id: string) {
    const user = await this.authRepo.findOneBy({ uniqueId: id });
    if (!user) return HttpError({ code: 'USER_NOT_FOUND' });
    const role = this.getPlayerRole(user.lastNickname);
    return { id: user.uniqueId, username: user.lastNickname, role };
  }

  async login(dto: LoginAuthDto) {
    const user = await this.authRepo.findOneBy({ lastNickname: dto.username });
    if (!user) return HttpError({ code: 'USER_NOT_FOUND' });

    let role = Role.USER;

    let passwordMatch = false;
    try {
      passwordMatch = await compare(dto.password, user.hashedPassword);
    } catch (error) {
      HttpError({ code: 'INVALID_PASSWORD_FORMAT' });
    }

    if (!passwordMatch) HttpError({ code: 'WRONG_PASSWORD' });

    role = Role[(await this.getPlayerRole(dto.username)).toUpperCase()];

    const [accessToken, refreshToken] = [
      sign(
        { id: user.uniqueId, username: user.lastNickname, role },
        env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '2h',
        },
      ),
      sign(
        { id: user.uniqueId, username: user.lastNickname, role },
        env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: '1d',
        },
      ),
    ];

    return {
      username: user.lastNickname,
      role,
      accessToken,
      refreshToken,
    };
  }

  async refresh(dto: RefreshAuthDto) {
    const token = dto.refreshToken;
    const authData = verify(token, env.REFRESH_TOKEN_SECRET) as {
      id: string;
      role: string;
      refreshTokenVersion: string;
    };
    if (!authData) HttpError({ code: 'LOGIN_FAILED' });

    const user = await this.authRepo.findOneBy({ uniqueId: authData.id });
    if (!user) HttpError({ code: 'USER_NOT_FOUND' });

    const accessToken = sign(
      { id: user.uniqueId, username: user.lastNickname, role: Role.USER },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: '2h' },
    );
    return { accessToken };
  }
}
