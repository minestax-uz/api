import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { HttpError } from 'src/common/exception/http.error';
import { LoginauthDto } from './dto/login-auth.dto';
import { env } from 'src/common/config';
import { RefreshauthDto } from './dto/refresh-auth.dto';
import { Role } from 'src/common/auth/roles/role.enum';
import { InjectRepository } from '@nestjs/typeorm';
import { Auth } from 'src/common/database/entities/auth.entity';
import { sign, verify } from 'jsonwebtoken';
import { compare } from 'src/common/utils/hash/hashing.utils';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private readonly authRepo: Repository<Auth>,
  ) {}

  async login(dto: LoginauthDto) {
    const user = await this.authRepo.findOneBy({ lastNickname: dto.username });
    if (!user) return HttpError({ code: 'USER_NOT_FOUND' });

    let passwordMatch = false;
    try {
      passwordMatch = await compare(dto.password, user.hashedPassword);
    } catch (error) {
      HttpError({ code: 'INVALID_PASSWORD_FORMAT' });
    }

    if (!passwordMatch) HttpError({ code: 'WRONG_PASSWORD' });

    const [accessToken, refreshToken] = [
      sign(
        { id: user.uniqueId, username: user.lastNickname, role: Role.User },
        env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: '2h',
        },
      ),
      sign(
        { id: user.uniqueId, username: user.lastNickname, role: Role.User },
        env.REFRESH_TOKEN_SECRET,
        {
          expiresIn: '1d',
        },
      ),
    ];

    return {
      username: user.lastNickname,
      accessToken,
      refreshToken,
    };
  }

  async refresh(dto: RefreshauthDto) {
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
      { id: user.uniqueId, username: user.lastNickname, role: Role.User },
      env.ACCESS_TOKEN_SECRET,
      { expiresIn: '2h' },
    );
    return { accessToken };
  }
}
