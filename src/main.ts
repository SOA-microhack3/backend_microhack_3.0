import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  // Enable CORS
  app.enableCors({
    origin: true,
    credentials: true,
  });

  // Global prefix
  app.setGlobalPrefix('api');

  // Validation pipe
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Swagger documentation
  const config = new DocumentBuilder()
    .setTitle('Intelligent Logistics Access Control API')
    .setDescription(
      'REST API for maritime port truck booking, QR code access control, and logistics management',
    )
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('Auth', 'Authentication endpoints')
    .addTag('Users', 'User management')
    .addTag('Ports', 'Port management')
    .addTag('Terminals', 'Terminal management')
    .addTag('Carriers', 'Carrier management')
    .addTag('Trucks', 'Truck fleet management')
    .addTag('Drivers', 'Driver management')
    .addTag('Operators', 'Operator management')
    .addTag('Bookings', 'Booking management')
    .addTag('QR Codes', 'QR code generation and validation')
    .addTag('Notifications', 'User notifications')
    .addTag('Logs', 'Audit logs')
    .addTag('Dashboard', 'Dashboard endpoints')
    .addTag('AI Integration', 'AI helpdesk integration')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('port') || 3000;
  await app.listen(port);

  console.log(`🚀 Application running on: http://localhost:${port}`);
  console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
