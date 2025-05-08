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

// Create an array of all Anarxiya entities
const ANARXIYA_ENTITIES = [
  ...Object.values(AnarxiyaPlanEntities),
  ...Object.values(AnarxiyaRankEntities),
  ...Object.values(AnarxiyaTokenEntities),
];

// Create the Anarxiya data source
const ANARXIYA_DATA_SOURCE = createDataSource(
  'anarxiya',
  's32_stats', // Database name
  ANARXIYA_ENTITIES,
);

// Provider for the Anarxiya data source
export const AnarxiyaDataSourceProvider = {
  provide: 'ANARXIYA_DATA_SOURCE',
  useFactory: async (moduleAvailabilityService: ModuleAvailabilityService) => {
    const [dataSource, isAvailable] = await safelyInitializeDataSource(
      ANARXIYA_DATA_SOURCE,
      'Anarxiya',
    );

    // Register the module's availability status
    moduleAvailabilityService.setModuleAvailability('anarxiya', isAvailable);

    // Return the data source (which may be null if initialization failed)
    return dataSource;
  },
  inject: [ModuleAvailabilityService],
};

@Module({
  imports: [
    TypeOrmModule.forRoot({
      name: 'anarxiya',
      type: 'mysql',
      host: process.env.ANARXIYA_DB_HOST || process.env.DB_HOST,
      port: parseInt(process.env.ANARXIYA_DB_PORT || process.env.DB_PORT),
      username: process.env.ANARXIYA_DB_USER || process.env.DB_USER,
      password: process.env.ANARXIYA_DB_PASS || process.env.DB_PASS,
      database: 's32_stats',
      entities: ANARXIYA_ENTITIES,
      synchronize: false,
    }),
  ],
  providers: [AnarxiyaDataSourceProvider],
  exports: [AnarxiyaDataSourceProvider, TypeOrmModule],
})
export class AnarxiyaDatabaseModule {}
