import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AppModule } from './app.module';
import * as os from 'os';

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

  // Listen on 0.0.0.0 to accept external connections
  await app.listen(port, '0.0.0.0');

  // --- IP DETECTION LOGIC ---
  const networkInterfaces = os.networkInterfaces();
  let myIp = 'localhost';

  for (const interfaceName of Object.keys(networkInterfaces)) {
    const interfaces = networkInterfaces[interfaceName];

    // FIX: Check if interfaces is defined before iterating
    if (interfaces) {
      for (const iface of interfaces) {
        // Skip internal (non-127.0.0.1) and non-ipv4 addresses
        if (iface.family === 'IPv4' && !iface.internal) {
          myIp = iface.address;
          break;
        }
      }
    }

    if (myIp !== 'localhost') break;
  }
  // --------------------------

  console.log(`\n🚀 Application running!`);
  console.log(`🏠 Local:   http://localhost:${port}/api`);
  console.log(`📡 Network: http://${myIp}:${port}/api`);
  console.log(`📚 Swagger: http://${myIp}:${port}/api/docs\n`);
}
bootstrap();