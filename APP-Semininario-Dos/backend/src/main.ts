import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ensureGeneratedOutputDirectory } from './output.config';

async function bootstrap() {
  ensureGeneratedOutputDirectory();
  const app = await NestFactory.create(AppModule);
  app.enableCors({ origin: process.env.FRONTEND_URL ?? 'http://localhost:5174' });
  await app.listen(Number(process.env.PORT) || 3001);
}
void bootstrap();
