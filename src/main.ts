import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from "@nestjs/platform-express";

import { ValidationPipe } from '@nestjs/common';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { cors: { origin: "huzz.wtf" }});

  app.set("trust proxy", 1);
  app.useGlobalPipes(new ValidationPipe({ disableErrorMessages: true }));

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();