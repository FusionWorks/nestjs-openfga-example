import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = new ConfigService();
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  const options = new DocumentBuilder()
    .setTitle('API')
    .setDescription('The API description')
    .setVersion('1.0')
    .addTag('API')
    .addOAuth2(
      {
        type: 'oauth2',
        flows: {
          implicit: {
            authorizationUrl: `https://${configService.get(
              'AUTH0_DOMAIN',
            )}/authorize?audience=${configService.get('AUTH0_AUDIENCE')}`,
            tokenUrl: configService.get('AUTH0_AUDIENCE'),
            scopes: {
              openid: 'Open Id',
              profile: 'Profile',
              email: 'E-mail',
            },
          },
        },
        scheme: 'bearer',
        bearerFormat: 'JWT',
        in: 'header',
      },
      'Auth0',
    )
    .build();
  // add auth0 auth to swagger

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document, {
    swaggerOptions: {
      initOAuth: {
        clientId: configService.get('AUTH0_OAUTH_CLIENT_ID'),
      },
    },
  });
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`Application is running on: ${await app.getUrl()}`);
}
bootstrap();
