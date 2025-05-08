import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenController } from './token.controller';
import { TokenService } from './token.service';
import {
  Points,
  PointsUsername,
} from 'src/common/database/entities/anarxiya/token.entity';
import { AnarxiyaDatabaseModule } from '../database/database.module';

@Module({
  imports: [
    AnarxiyaDatabaseModule,
    TypeOrmModule.forFeature([Points, PointsUsername]),
  ],
  controllers: [TokenController],
  providers: [TokenService],
})
export class TokenModule {}
