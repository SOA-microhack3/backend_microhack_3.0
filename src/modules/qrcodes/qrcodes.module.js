"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodesModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const jwt_1 = require("@nestjs/jwt");
const config_1 = require("@nestjs/config");
const qrcodes_controller_1 = require("./qrcodes.controller");
const qrcodes_service_1 = require("./qrcodes.service");
const qrcode_entity_1 = require("./entities/qrcode.entity");
const booking_entity_1 = require("../bookings/entities/booking.entity");
const bookings_module_1 = require("../bookings/bookings.module");
@(0, common_1.Module)({
    imports: [
        typeorm_1.TypeOrmModule.forFeature([qrcode_entity_1.QrCode, booking_entity_1.Booking]),
        jwt_1.JwtModule.registerAsync({
            imports: [config_1.ConfigModule],
            useFactory: async (configService) => ({
                secret: configService.get('jwt.secret'),
            }),
            inject: [config_1.ConfigService],
        }),
        (0, common_1.forwardRef)(() => bookings_module_1.BookingsModule),
    ],
    controllers: [qrcodes_controller_1.QrCodesController],
    providers: [qrcodes_service_1.QrCodesService],
    exports: [qrcodes_service_1.QrCodesService],
})
class QrCodesModule {
}
exports.QrCodesModule = QrCodesModule;
