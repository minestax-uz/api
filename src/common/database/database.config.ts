import { env } from '../config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export const DatabaseConfig: TypeOrmModuleOptions = {
  type: 'mysql',
  host: env.DB_HOST,
  port: env.DB_PORT,
  username: env.DB_USER,
  password: env.DB_PASS,
  database: 's1_bans',
  synchronize: false,
  autoLoadEntities: true,
};
