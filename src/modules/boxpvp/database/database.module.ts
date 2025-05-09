import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  createDataSource,
  safelyInitializeDataSource,
} from 'src/common/database/database.config';
import { ModuleAvailabilityService } from 'src/common/service/module-availability.service';

// Import all BoxPVP entities
import * as BoxpvpPlanEntities from 'src/common/database/entities/boxpvp/boxpvpPlan.entity';
import * as BoxpvpRankEntities from 'src/common/database/entities/boxpvp/boxpvpRank.entity';

// Import all BoxPVP entities for use in the module

// Create the BoxPVP data sources
const BOXPVP_STATS_DATA_SOURCE = createDataSource(
  'boxpvp',
  's12_stats', // Stats database name
  Object.values(BoxpvpPlanEntities),
);

const BOXPVP_RANK_DATA_SOURCE = createDataSource(
  'boxpvp_rank',
  's12_rank', // Rank database name
  Object.values(BoxpvpRankEntities),
);

// Provider for the BoxPVP stats data source
export const BoxpvpStatsDataSourceProvider = {
  provide: 'BOXPVP_STATS_DATA_SOURCE',
  useFactory: async (moduleAvailabilityService: ModuleAvailabilityService) => {
    const [dataSource, isAvailable] = await safelyInitializeDataSource(
      BOXPVP_STATS_DATA_SOURCE,
      'BoxPVP Stats',
    );

    // Register the module's availability status
    moduleAvailabilityService.setModuleAvailability('boxpvp', isAvailable);

    // Return the data source (which may be null if initialization failed)
    return dataSource;
  },
  inject: [ModuleAvailabilityService],
};

// Provider for the BoxPVP rank data source
export const BoxpvpRankDataSourceProvider = {
  provide: 'BOXPVP_RANK_DATA_SOURCE',
  useFactory: async (moduleAvailabilityService: ModuleAvailabilityService) => {
    const [dataSource] = await safelyInitializeDataSource(
      BOXPVP_RANK_DATA_SOURCE,
      'BoxPVP Rank',
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
      name: 'boxpvp',
      type: 'mysql',
      host: process.env.BOXPVP_DB_HOST || process.env.DB_HOST,
      port: parseInt(process.env.BOXPVP_DB_PORT || process.env.DB_PORT),
      username: process.env.BOXPVP_DB_USER || process.env.DB_USER,
      password: process.env.BOXPVP_DB_PASS || process.env.DB_PASS,
      database: 's12_stats',
      entities: Object.values(BoxpvpPlanEntities),
      synchronize: false,
    }),
    // Rank database connection
    TypeOrmModule.forRoot({
      name: 'boxpvp_rank',
      type: 'mysql',
      host: process.env.BOXPVP_DB_HOST || process.env.DB_HOST,
      port: parseInt(process.env.BOXPVP_DB_PORT || process.env.DB_PORT),
      username: process.env.BOXPVP_DB_USER || process.env.DB_USER,
      password: process.env.BOXPVP_DB_PASS || process.env.DB_PASS,
      database: 's12_rank',
      entities: Object.values(BoxpvpRankEntities),
      synchronize: false,
    }),
  ],
  providers: [BoxpvpStatsDataSourceProvider, BoxpvpRankDataSourceProvider],
  exports: [
    BoxpvpStatsDataSourceProvider,
    BoxpvpRankDataSourceProvider,
    TypeOrmModule,
  ],
})
export class BoxpvpDatabaseModule {}
