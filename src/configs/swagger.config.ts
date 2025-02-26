import { DocumentBuilder } from '@nestjs/swagger';

export const swaggerConfig = new DocumentBuilder()
  .setTitle('event-backend')
  .setDescription('')
  .setVersion('1.0.0')
  .addBearerAuth()
  .build();

export const swaggerOptions = {
  swaggerOptions: { defaultModelsExpandDepth: -1 },
};
