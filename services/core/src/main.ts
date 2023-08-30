import helmet from 'helmet';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import { JwtExpirationFilter } from './auth/jwt-expiration.filter';

async function bootstrap() {
  const config = new DocumentBuilder()
    .setTitle('Core api')
    .setDescription('Core api description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        description: `Please enter token. It will attach header Authorization: Bearer access_token`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        scheme: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'access-token', // This name here is important for matching up with @ApiBearerAuth() in your controller!
    )
    .build();

  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  app.useGlobalFilters(new JwtExpirationFilter());

  app.use(helmet());

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('swagger', app, document);
  await app.listen(3000);
}
bootstrap();
