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

// Create an array of all Survival entities
const SURVIVAL_ENTITIES = [
  ...Object.values(SurvivalPlanEntities),
  ...Object.values(SurvivalRankEntities),
];

// Create the Survival data source
const SURVIVAL_DATA_SOURCE = createDataSource(
  'survival',
  's13_stats', // Database name
  SURVIVAL_ENTITIES,
);

// Provider for the Survival data source
export const SurvivalDataSourceProvider = {
  provide: 'SURVIVAL_DATA_SOURCE',
  useFactory: async (moduleAvailabilityService: ModuleAvailabilityService) => {
    const [dataSource, isAvailable] = await safelyInitializeDataSource(
      SURVIVAL_DATA_SOURCE,
      'Survival',
    );

    // Register the module's availability status
    moduleAvailabilityService.setModuleAvailability('survival', isAvailable);

    // Return the data source (which may be null if initialization failed)
    return dataSource;
  },
  inject: [ModuleAvailabilityService],
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'survival',
      type: 'mysql',
      host: process.env.SURVIVAL_DB_HOST || process.env.DB_HOST,
      port: parseInt(process.env.SURVIVAL_DB_PORT || process.env.DB_PORT),
      username: process.env.SURVIVAL_DB_USER || process.env.DB_USER,
      password: process.env.SURVIVAL_DB_PASS || process.env.DB_PASS,
      database: 's13_stats',
      entities: SURVIVAL_ENTITIES,
      synchronize: false,
    }),
  ],
  providers: [SurvivalDataSourceProvider],
  exports: [SurvivalDataSourceProvider, TypeOrmModule],
})
export class SurvivalDatabaseModule {}
