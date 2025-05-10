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
import { BoxpvpPermissionsService as BoxpvpRankService } from 'src/modules/boxpvp/permissions/permissions.service';
import { AnarxiyaPermissionsService as AnarxiyaRankService } from 'src/modules/anarxiya/permissions/permissions.service';
import { SurvivalPermissionsService as SurvivalRankService } from 'src/modules/survival/permissions/permissions.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
    private anarxiyaRankService: AnarxiyaRankService,
    private survivalRankService: SurvivalRankService,
    private boxpvpRankService: BoxpvpRankService,
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

    // Create tokens with explicit expiration times
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const accessTokenExpiry = now + 2 * 60 * 60; // 2 hours from now
    const refreshTokenExpiry = now + 24 * 60 * 60; // 24 hours from now

    const [accessToken, refreshToken] = [
      sign(
        {
          id: user.uniqueId,
          username: user.lastNickname,
          role,
          iat: now,
          exp: accessTokenExpiry,
        },
        env.ACCESS_TOKEN_SECRET,
      ),
      sign(
        {
          id: user.uniqueId,
          username: user.lastNickname,
          role,
          iat: now,
          exp: refreshTokenExpiry,
        },
        env.REFRESH_TOKEN_SECRET,
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

    // Create a new access token with explicit expiration time
    const now = Math.floor(Date.now() / 1000); // Current time in seconds
    const accessTokenExpiry = now + 2 * 60 * 60; // 2 hours from now

    const accessToken = sign(
      {
        id: user.uniqueId,
        username: user.lastNickname,
        role: authData.role || Role.USER, // Use the role from the refresh token or default to USER
        iat: now,
        exp: accessTokenExpiry,
      },
      env.ACCESS_TOKEN_SECRET,
    );
    // Return the new access token
    return {
      accessToken,
      // Include the username and role for consistency
      username: user.lastNickname,
      role: authData.role || Role.USER,
    };
  }
}
