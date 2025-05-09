import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  createDataSource,
  safelyInitializeDataSource,
} from 'src/common/database/database.config';
import { ModuleAvailabilityService } from 'src/common/service/module-availability.service';

// Import all Survival entities
import * as SurvivalPlanEntities from 'src/common/database/entities/survival/survivalPlan.entity';
import * as SurvivalRankEntities from 'src/common/database/entities/survival/survivalRank.entity';

// Import all Survival entities for use in the module

// Create the Survival data sources
const SURVIVAL_STATS_DATA_SOURCE = createDataSource(
  'survival',
  's13_stats', // Stats database name
  Object.values(SurvivalPlanEntities),
);

const SURVIVAL_RANK_DATA_SOURCE = createDataSource(
  'survival_rank',
  's13_rank', // Rank database name
  Object.values(SurvivalRankEntities),
);

// Provider for the Survival stats data source
export const SurvivalStatsDataSourceProvider = {
  provide: 'SURVIVAL_STATS_DATA_SOURCE',
  useFactory: async (moduleAvailabilityService: ModuleAvailabilityService) => {
    const [dataSource, isAvailable] = await safelyInitializeDataSource(
      SURVIVAL_STATS_DATA_SOURCE,
      'Survival Stats',
    );

    // Register the module's availability status
    moduleAvailabilityService.setModuleAvailability('survival', isAvailable);

    // Return the data source (which may be null if initialization failed)
    return dataSource;
  },
  inject: [ModuleAvailabilityService],
};

// Provider for the Survival rank data source
export const SurvivalRankDataSourceProvider = {
  provide: 'SURVIVAL_RANK_DATA_SOURCE',
  useFactory: async (moduleAvailabilityService: ModuleAvailabilityService) => {
    const [dataSource] = await safelyInitializeDataSource(
      SURVIVAL_RANK_DATA_SOURCE,
      'Survival Rank',
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
      name: 'survival',
      type: 'mysql',
      host: process.env.SURVIVAL_DB_HOST || process.env.DB_HOST,
      port: parseInt(process.env.SURVIVAL_DB_PORT || process.env.DB_PORT),
      username: process.env.SURVIVAL_DB_USER || process.env.DB_USER,
      password: process.env.SURVIVAL_DB_PASS || process.env.DB_PASS,
      database: 's13_stats',
      entities: Object.values(SurvivalPlanEntities),
      synchronize: false,
    }),
    // Rank database connection
    TypeOrmModule.forRoot({
      name: 'survival_rank',
      type: 'mysql',
      host: process.env.SURVIVAL_DB_HOST || process.env.DB_HOST,
      port: parseInt(process.env.SURVIVAL_DB_PORT || process.env.DB_PORT),
      username: process.env.SURVIVAL_DB_USER || process.env.DB_USER,
      password: process.env.SURVIVAL_DB_PASS || process.env.DB_PASS,
      database: 's13_rank',
      entities: Object.values(SurvivalRankEntities),
      synchronize: false,
    }),
  ],
  providers: [SurvivalStatsDataSourceProvider, SurvivalRankDataSourceProvider],
  exports: [
    SurvivalStatsDataSourceProvider,
    SurvivalRankDataSourceProvider,
    TypeOrmModule,
  ],
})
export class SurvivalDatabaseModule {}
