import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BansService } from './bans.service';
import { BansController } from './bans.controller';
import { Bans } from 'src/common/database/entities/bans/bans.entity';
import { Comment } from 'src/common/database/entities/bans/comments.entity';
import { Proof } from 'src/common/database/entities/bans/proof.entity';
import { BansDatabaseModule } from './database/database.module';

@Module({
  imports: [
    BansDatabaseModule,
    TypeOrmModule.forFeature([Bans, Comment, Proof], 'bans'),
  ],
  controllers: [BansController],
  providers: [BansService],
})
export class BansModule {}
