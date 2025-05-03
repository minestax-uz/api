import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseConfig } from './common/database/database.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { AnarxiyaModule } from './modules/anarxiya/anarxiya.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DatabaseConfig),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      serveRoot: '/public',
    }),
    AuthModule,
    AnarxiyaModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
