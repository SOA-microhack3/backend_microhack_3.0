import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import configuration from './config/configuration';

// Common
import { HttpExceptionFilter } from './common/filters';
import { TransformInterceptor } from './common/interceptors';
import { JwtAuthGuard, RolesGuard } from './common/guards';

// Feature Modules
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { PortsModule } from './modules/ports/ports.module';
import { TerminalsModule } from './modules/terminals/terminals.module';
import { CarriersModule } from './modules/carriers/carriers.module';
import { TrucksModule } from './modules/trucks/trucks.module';
import { DriversModule } from './modules/drivers/drivers.module';
import { OperatorsModule } from './modules/operators/operators.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { QrCodesModule } from './modules/qrcodes/qrcodes.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { LogsModule } from './modules/logs/logs.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AiModule } from './modules/ai/ai.module';
import { AiAgentModule } from './modules/ai-agent/ai-agent.module';
import { AdminSeedService } from './seed/admin-seed.service';
import { PortsSeedService } from './seed/ports-seed.service';
import { TerminalsSeedService } from './seed/terminals-seed.service';
import { DemoSeedService } from './seed/demo-seed.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('database.host'),
        port: configService.get('database.port'),
        username: configService.get('database.username'),
        password: configService.get('database.password'),
        database: configService.get('database.database'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: configService.get('nodeEnv') === 'development',
      }),
      inject: [ConfigService],
    }),
    // Feature Modules
    AuthModule,
    UsersModule,
    PortsModule,
    TerminalsModule,
    CarriersModule,
    TrucksModule,
    DriversModule,
    OperatorsModule,
    BookingsModule,
    QrCodesModule,
    NotificationsModule,
    LogsModule,
    DashboardModule,
    AiModule,
    AiAgentModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AdminSeedService,
    PortsSeedService,
    TerminalsSeedService,
    DemoSeedService,
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: TransformInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule { }
