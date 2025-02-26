import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ENV } from 'src/constants/env.constant';

export const TYPEORM_CONFIG: TypeOrmModuleOptions = {
  type: 'postgres',
  host: ENV.PSQL.HOST,
  port: ENV.PSQL.PORT,
  username: ENV.PSQL.USERNAME,
  password: ENV.PSQL.PASSWORD,
  database: ENV.PSQL.DATABASE,
  autoLoadEntities: true,
  synchronize: true,
  // ssl: {
  //   rejectUnauthorized: false,
  // },
};
