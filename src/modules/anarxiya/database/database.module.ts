import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  createDataSource,
  safelyInitializeDataSource,
} from 'src/common/database/database.config';
import { ModuleAvailabilityService } from 'src/common/service/module-availability.service';

// Import all Anarxiya entities
import * as AnarxiyaPlanEntities from 'src/common/database/entities/anarxiya/anarxiyaPlan.entity';
import * as AnarxiyaRankEntities from 'src/common/database/entities/anarxiya/anarxiyaRank.entity';
import * as AnarxiyaTokenEntities from 'src/common/database/entities/anarxiya/token.entity';

// Import all Anarxiya entities for use in the module

// Create the Anarxiya data sources
const ANARXIYA_STATS_DATA_SOURCE = createDataSource(
  'anarxiya',
  's32_stats', // Stats database name
  Object.values(AnarxiyaPlanEntities),
);

const ANARXIYA_RANK_DATA_SOURCE = createDataSource(
  'anarxiya_rank',
  's32_rank', // Rank database name
  Object.values(AnarxiyaRankEntities),
);

// Provider for the Anarxiya stats data source
export const AnarxiyaStatsDataSourceProvider = {
  provide: 'ANARXIYA_STATS_DATA_SOURCE',
  useFactory: async (moduleAvailabilityService: ModuleAvailabilityService) => {
    const [dataSource, isAvailable] = await safelyInitializeDataSource(
      ANARXIYA_STATS_DATA_SOURCE,
      'Anarxiya Stats',
    );

    // Register the module's availability status
    moduleAvailabilityService.setModuleAvailability('anarxiya', isAvailable);

    // Return the data source (which may be null if initialization failed)
    return dataSource;
  },
  inject: [ModuleAvailabilityService],
};

// Provider for the Anarxiya rank data source
export const AnarxiyaRankDataSourceProvider = {
  provide: 'ANARXIYA_RANK_DATA_SOURCE',
  useFactory: async (moduleAvailabilityService: ModuleAvailabilityService) => {
    const [dataSource] = await safelyInitializeDataSource(
      ANARXIYA_RANK_DATA_SOURCE,
      'Anarxiya Rank',
    );

    // We don't set module availability here as it's already set by the stats provider
    // This is to avoid overriding the availability status

    // Return the data source (which may be null if initialization failed)
    return dataSource;
  },
  inject: [ModuleAvailabilityService],
};

@Module({
  imports: [
    // Stats database connection
    TypeOrmModule.forRoot({
      name: 'anarxiya',
      type: 'mysql',
      host: process.env.ANARXIYA_DB_HOST || process.env.DB_HOST,
      port: parseInt(process.env.ANARXIYA_DB_PORT || process.env.DB_PORT),
      username: process.env.ANARXIYA_DB_USER || process.env.DB_USER,
      password: process.env.ANARXIYA_DB_PASS || process.env.DB_PASS,
      database: 's32_stats',
      entities: Object.values(AnarxiyaPlanEntities),
      synchronize: false,
    }),
    // Rank database connection
    TypeOrmModule.forRoot({
      name: 'anarxiya_rank',
      type: 'mysql',
      host: process.env.ANARXIYA_DB_HOST || process.env.DB_HOST,
      port: parseInt(process.env.ANARXIYA_DB_PORT || process.env.DB_PORT),
      username: process.env.ANARXIYA_DB_USER || process.env.DB_USER,
      password: process.env.ANARXIYA_DB_PASS || process.env.DB_PASS,
      database: 's32_rank',
      entities: Object.values(AnarxiyaRankEntities),
      synchronize: false,
    }),
    // Token database connection (if needed)
    TypeOrmModule.forRoot({
      name: 'anarxiya_token',
      type: 'mysql',
      host: process.env.ANARXIYA_DB_HOST || process.env.DB_HOST,
      port: parseInt(process.env.ANARXIYA_DB_PORT || process.env.DB_PORT),
      username: process.env.ANARXIYA_DB_USER || process.env.DB_USER,
      password: process.env.ANARXIYA_DB_PASS || process.env.DB_PASS,
      database: 's32_token',
      entities: Object.values(AnarxiyaTokenEntities),
      synchronize: false,
    }),
  ],
  providers: [AnarxiyaStatsDataSourceProvider, AnarxiyaRankDataSourceProvider],
  exports: [
    AnarxiyaStatsDataSourceProvider,
    AnarxiyaRankDataSourceProvider,
    TypeOrmModule,
  ],
})
export class AnarxiyaDatabaseModule {}
