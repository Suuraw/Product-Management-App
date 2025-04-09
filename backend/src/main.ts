import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useStaticAssets(join(__dirname, '..', 'uploads'), { prefix: '/uploads/' }); // Serve uploaded images
  const PORT = 3000;
  await app.listen(PORT, () => {
    console.log(`The server is running on port ${PORT}`);
  });
}
bootstrap();