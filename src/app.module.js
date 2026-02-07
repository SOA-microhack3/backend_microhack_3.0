"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const configuration_1 = __importDefault(require("./config/configuration"));
const filters_1 = require("./common/filters");
const interceptors_1 = require("./common/interceptors");
const guards_1 = require("./common/guards");
const auth_module_1 = require("./modules/auth/auth.module");
const users_module_1 = require("./modules/users/users.module");
const ports_module_1 = require("./modules/ports/ports.module");
const terminals_module_1 = require("./modules/terminals/terminals.module");
const carriers_module_1 = require("./modules/carriers/carriers.module");
const trucks_module_1 = require("./modules/trucks/trucks.module");
const drivers_module_1 = require("./modules/drivers/drivers.module");
const operators_module_1 = require("./modules/operators/operators.module");
const bookings_module_1 = require("./modules/bookings/bookings.module");
const qrcodes_module_1 = require("./modules/qrcodes/qrcodes.module");
const notifications_module_1 = require("./modules/notifications/notifications.module");
const logs_module_1 = require("./modules/logs/logs.module");
const dashboard_module_1 = require("./modules/dashboard/dashboard.module");
const ai_module_1 = require("./modules/ai/ai.module");
const ai_agent_module_1 = require("./modules/ai-agent/ai-agent.module");
const admin_seed_service_1 = require("./seed/admin-seed.service");
const ports_seed_service_1 = require("./seed/ports-seed.service");
const terminals_seed_service_1 = require("./seed/terminals-seed.service");
const demo_seed_service_1 = require("./seed/demo-seed.service");
@(0, common_1.Module)({
    imports: [
        config_1.ConfigModule.forRoot({
            isGlobal: true,
            load: [configuration_1.default],
        }),
        typeorm_1.TypeOrmModule.forRootAsync({
            imports: [config_1.ConfigModule],
            useFactory: (configService) => ({
                type: 'postgres',
                host: configService.get('database.host'),
                port: configService.get('database.port'),
                username: configService.get('database.username'),
                password: configService.get('database.password'),
                database: configService.get('database.database'),
                entities: [__dirname + '/**/*.entity{.ts,.js}'],
                synchronize: configService.get('nodeEnv') === 'development',
            }),
            inject: [config_1.ConfigService],
        }),
        auth_module_1.AuthModule,
        users_module_1.UsersModule,
        ports_module_1.PortsModule,
        terminals_module_1.TerminalsModule,
        carriers_module_1.CarriersModule,
        trucks_module_1.TrucksModule,
        drivers_module_1.DriversModule,
        operators_module_1.OperatorsModule,
        bookings_module_1.BookingsModule,
        qrcodes_module_1.QrCodesModule,
        notifications_module_1.NotificationsModule,
        logs_module_1.LogsModule,
        dashboard_module_1.DashboardModule,
        ai_module_1.AiModule,
        ai_agent_module_1.AiAgentModule,
    ],
    controllers: [app_controller_1.AppController],
    providers: [
        app_service_1.AppService,
        admin_seed_service_1.AdminSeedService,
        ports_seed_service_1.PortsSeedService,
        terminals_seed_service_1.TerminalsSeedService,
        demo_seed_service_1.DemoSeedService,
        {
            provide: core_1.APP_FILTER,
            useClass: filters_1.HttpExceptionFilter,
        },
        {
            provide: core_1.APP_INTERCEPTOR,
            useClass: interceptors_1.TransformInterceptor,
        },
        {
            provide: core_1.APP_GUARD,
            useClass: guards_1.JwtAuthGuard,
        },
        {
            provide: core_1.APP_GUARD,
            useClass: guards_1.RolesGuard,
        },
    ],
})
class AppModule {
}
exports.AppModule = AppModule;
