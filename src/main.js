"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const config_1 = require("@nestjs/config");
const app_module_1 = require("./app.module");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const configService = app.get(config_1.ConfigService);
    app.enableCors({
        origin: true,
        credentials: true,
    });
    app.setGlobalPrefix('api');
    app.useGlobalPipes(new common_1.ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }));
    const config = new swagger_1.DocumentBuilder()
        .setTitle('Intelligent Logistics Access Control API')
        .setDescription('REST API for maritime port truck booking, QR code access control, and logistics management')
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
    const document = swagger_1.SwaggerModule.createDocument(app, config);
    swagger_1.SwaggerModule.setup('api/docs', app, document);
    const port = configService.get('port') || 3000;
    await app.listen(port);
    console.log(`🚀 Application running on: http://localhost:${port}`);
    console.log(`📚 Swagger docs: http://localhost:${port}/api/docs`);
}
bootstrap();
