import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ENV } from 'src/constants/env.constant';

export const TYPEORM_CONFIG: TypeOrmModuleOptions = {
  type: 'postgres',
  host: process.env.DB_PORT,
  port: ENV.PSQL.PORT,
  username: ENV.PSQL.USERNAME,
  password: ENV.PSQL.PASSWORD,
  database: ENV.PSQL.DATABASE,
  autoLoadEntities: true,
  synchronize: true,
  ssl: {
    rejectUnauthorized: false,
  },
};
