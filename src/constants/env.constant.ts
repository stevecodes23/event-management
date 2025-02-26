import { HttpException, HttpStatus } from '@nestjs/common';
function getEnvVariable(name: string) {
  const envVar = process.env[name];
  console.log('reaching here :', envVar);
  if (!envVar) {
    throw new HttpException(
      `Environment variable ${name} not found`,
      HttpStatus.FAILED_DEPENDENCY,
    );
  }
  return envVar;
}
export const ENV = {
  PORT: getEnvVariable('PORT'),
  PSQL: {
    HOST: getEnvVariable('DB_HOST'),
    PORT: parseInt(getEnvVariable('DB_PORT')),
    USERNAME: getEnvVariable('DB_USERNAME'),
    PASSWORD: getEnvVariable('DB_PASSWORD'),
    DATABASE: getEnvVariable('DB_DATABASE'),
  },
  JWT: {
    EXPIRY: getEnvVariable('JWT_EXPIRY'),
    SECRET: getEnvVariable('JWT_AUTHSECRET'),
  },
};
