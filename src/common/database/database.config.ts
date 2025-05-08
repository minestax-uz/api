import { env } from '../config';
import { DataSource, DataSourceOptions } from 'typeorm';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Logger } from '@nestjs/common';

// Base database configuration
export const BaseDbConfig = {
  type: 'mysql' as const,
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  synchronize: false,
  // Add connection retry options
  retryAttempts: 3,
  retryDelay: 3000,
  autoLoadEntities: false,
  keepConnectionAlive: true,
};

// Default connection for auth, bans, etc.
export const DefaultDatabaseConfig: TypeOrmModuleOptions = {
  ...BaseDbConfig,
  name: 'default',
  database: 's1_bans',
  entities: [
    __dirname + '/entities/auth.entity.{js,ts}',
    __dirname + '/entities/bans/**/*.entity.{js,ts}',
  ],
};

/**
 * Creates a dynamic data source for a specific module
 * @param name The name of the data source
 * @param database The database name
 * @param entities The entities to include
 * @returns A DataSource instance
 */
export function createDataSource(
  name: string,
  database: string,
  entities: any[],
): DataSource {
  const options: DataSourceOptions = {
    ...BaseDbConfig,
    name,
    database,
    entities,
  };

  return new DataSource(options);
}

/**
 * Safely initializes a data source with error handling
 * @param dataSource The data source to initialize
 * @param moduleName The name of the module for logging purposes
 * @returns A tuple containing [initialized DataSource or null, boolean indicating success]
 */
export async function safelyInitializeDataSource(
  dataSource: DataSource,
  moduleName: string,
): Promise<[DataSource | null, boolean]> {
  const logger = new Logger(`${moduleName}DatabaseModule`);

  if (dataSource.isInitialized) {
    return [dataSource, true];
  }

  try {
    await dataSource.initialize();
    logger.log(`Successfully connected to ${moduleName} database`);
    return [dataSource, true];
  } catch (error) {
    logger.error(
      `Failed to connect to ${moduleName} database: ${error.message}`,
    );
    logger.warn(
      `${moduleName} module will be disabled due to database connection failure`,
    );
    return [null, false];
  }
}
