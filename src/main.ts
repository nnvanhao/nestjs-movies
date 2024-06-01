import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { json, urlencoded } from 'express';
import { AppModule } from './app.module';

async function bootstrap() {
  dotenv.config();
  const LIMIT_PAYLOAD = '50mb';
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors();
  app.use(json({ limit: LIMIT_PAYLOAD }));
  app.use(urlencoded({ extended: true, limit: LIMIT_PAYLOAD }));

  const config = new DocumentBuilder()
    .setTitle('NestJs Platform')
    .setDescription('NestJs Platform API description')
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  app.enableCors();

  await app.listen(process.env.PORT);
}
bootstrap();
