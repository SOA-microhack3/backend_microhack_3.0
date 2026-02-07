"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const passport_1 = require("@nestjs/passport");
const typeorm_1 = require("@nestjs/typeorm");
const config_1 = require("@nestjs/config");
const auth_controller_1 = require("./auth.controller");
const auth_service_1 = require("./auth.service");
const jwt_strategy_1 = require("./strategies/jwt.strategy");
const user_entity_1 = require("../users/entities/user.entity");
@(0, common_1.Module)({
    imports: [
        typeorm_1.TypeOrmModule.forFeature([user_entity_1.User]),
        passport_1.PassportModule.register({ defaultStrategy: 'jwt' }),
        jwt_1.JwtModule.registerAsync({
            imports: [config_1.ConfigModule],
            useFactory: async (configService) => ({
                secret: configService.get('jwt.secret') ?? 'default-secret',
                signOptions: {
                    expiresIn: (configService.get('jwt.expiration') ?? '1d'),
                },
            }),
            inject: [config_1.ConfigService],
        }),
    ],
    controllers: [auth_controller_1.AuthController],
    providers: [auth_service_1.AuthService, jwt_strategy_1.JwtStrategy],
    exports: [auth_service_1.AuthService, jwt_1.JwtModule],
})
class AuthModule {
}
exports.AuthModule = AuthModule;
