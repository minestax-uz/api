import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BaseDbConfig } from 'src/common/database/database.config';
import { Bans } from 'src/common/database/entities/bans/bans.entity';
import { Comment } from 'src/common/database/entities/bans/comments.entity';
import { Proof } from 'src/common/database/entities/bans/proof.entity';

@Module({
  imports: [
    // Bans database connection
    TypeOrmModule.forRoot({
      ...BaseDbConfig,
      name: 'bans',
      database: 's1_bans',
      entities: [Bans, Comment, Proof],
      synchronize: false,
    }),
  ],
  exports: [TypeOrmModule],
})
export class BansDatabaseModule {}
