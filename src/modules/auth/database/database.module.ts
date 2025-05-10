import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Auth } from 'src/common/database/entities/auth.entity';
import { BaseDbConfig } from 'src/common/database/database.config';

@Module({
  imports: [
    // Auth database connection
    TypeOrmModule.forRoot({
      ...BaseDbConfig,
      name: 'auth',
      database: 's1_auth',
      entities: [Auth],
      synchronize: false,
    }),
  ],
  exports: [TypeOrmModule],
})
export class AuthDatabaseModule {}
