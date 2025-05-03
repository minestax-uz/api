import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BansService } from './bans.service';
import { BansController } from './bans.controller';
import { Bans } from 'src/common/database/entities/bans/bans.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Bans])],
  controllers: [BansController],
  providers: [BansService],
})
export class BansModule {}
