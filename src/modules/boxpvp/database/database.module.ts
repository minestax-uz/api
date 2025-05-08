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

// Create an array of all BoxPVP entities
const BOXPVP_ENTITIES = [
  ...Object.values(BoxpvpPlanEntities),
  ...Object.values(BoxpvpRankEntities),
];

// Create the BoxPVP data source
const BOXPVP_DATA_SOURCE = createDataSource(
  'boxpvp',
  's12_stats', // Database name
  BOXPVP_ENTITIES,
);

// Provider for the BoxPVP data source
export const BoxpvpDataSourceProvider = {
  provide: 'BOXPVP_DATA_SOURCE',
  useFactory: async (moduleAvailabilityService: ModuleAvailabilityService) => {
    const [dataSource, isAvailable] = await safelyInitializeDataSource(
      BOXPVP_DATA_SOURCE,
      'BoxPVP',
    );

    // Register the module's availability status
    moduleAvailabilityService.setModuleAvailability('boxpvp', isAvailable);

    // Return the data source (which may be null if initialization failed)
    return dataSource;
  },
  inject: [ModuleAvailabilityService],
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'boxpvp',
      type: 'mysql',
      host: process.env.BOXPVP_DB_HOST || process.env.DB_HOST,
      port: parseInt(process.env.BOXPVP_DB_PORT || process.env.DB_PORT),
      username: process.env.BOXPVP_DB_USER || process.env.DB_USER,
      password: process.env.BOXPVP_DB_PASS || process.env.DB_PASS,
      database: 's12_stats',
      entities: BOXPVP_ENTITIES,
      synchronize: false,
    }),
  ],
  providers: [BoxpvpDataSourceProvider],
  exports: [BoxpvpDataSourceProvider, TypeOrmModule],
})
export class BoxpvpDatabaseModule {}
