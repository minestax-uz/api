import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DefaultDatabaseConfig } from './common/database/database.config';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AuthModule } from './modules/auth/auth.module';
import { AnarxiyaModule } from './modules/anarxiya/anarxiya.module';
import { SurvivalModule } from './modules/survival/survival.module';
import { BoxpvpModule } from './modules/boxpvp/boxpvp.module';
import { BansModule } from './modules/bans/bans.module';
import { ModuleAvailabilityModule } from './common/service/module-availability.module';

@Module({
  imports: [
    // Register the module availability service first
    ModuleAvailabilityModule,

    // Register only the default database connection
    TypeOrmModule.forRoot(DefaultDatabaseConfig),

    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'),
      serveRoot: '/uploads',
    }),
    AuthModule,
    AnarxiyaModule,
    SurvivalModule,
    BoxpvpModule,
    BansModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
