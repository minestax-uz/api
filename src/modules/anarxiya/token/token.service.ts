import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { HttpError } from 'src/common/exception/http.error';
import { InjectRepository } from '@nestjs/typeorm';
import {
  Points,
  PointsUsername,
} from 'src/common/database/entities/token.entity';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Points) private readonly pointsRepo: Repository<Points>,
    @InjectRepository(PointsUsername)
    private readonly usernameRepo: Repository<PointsUsername>,
  ) {}

  async getPointsByUsername(username: string) {
    const pointsUsername = await this.usernameRepo.findOneBy({ username });
    if (!pointsUsername) HttpError({ code: 'USER_NOT_FOUND' });
    return await this.pointsRepo.findOneBy({ uuid: pointsUsername.uuid });
  }

  async add(username: string, points: number) {
    const user = await this.getPointsByUsername(username);
    user.points += points;
    return (await this.pointsRepo.save(user)).points;
  }

  async set(username: string, points: number) {
    const user = await this.getPointsByUsername(username);
    user.points = points;
    return (await this.pointsRepo.save(user)).points;
  }

  async remove(username: string, points: number) {
    const user = await this.getPointsByUsername(username);
    user.points -= points;
    return (await this.pointsRepo.save(user)).points;
  }

  async get(username: string) {
    const user = await this.getPointsByUsername(username);
    return user.points;
  }
}
