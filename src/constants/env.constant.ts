import { HttpException, HttpStatus } from '@nestjs/common';
import { config } from 'dotenv';
config({ path: '.env' });

function getEnvVariable(name) {
  const envVar = process.env[name];
  console.log(`env variable ${name}`, envVar);
  if (!envVar)
    throw new HttpException(
      `No Such Env:${name} variable`,
      HttpStatus.FAILED_DEPENDENCY,
    );
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
  STRIPE: {
    KEY: getEnvVariable('STRIPE_KEY'),
  },
  POSTMARK: {
    API_KEY: getEnvVariable('POSTMARK_API_KEY'),
  },
  EMAIL:{
    EMAIL_ID: getEnvVariable('EMAIL_ID'),
  }
};
