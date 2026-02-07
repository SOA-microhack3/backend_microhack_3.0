"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const bookings_controller_1 = require("./bookings.controller");
const bookings_service_1 = require("./bookings.service");
const booking_entity_1 = require("./entities/booking.entity");
const terminal_entity_1 = require("../terminals/entities/terminal.entity");
const truck_entity_1 = require("../trucks/entities/truck.entity");
const driver_entity_1 = require("../drivers/entities/driver.entity");
const carrier_entity_1 = require("../carriers/entities/carrier.entity");
const operator_entity_1 = require("../operators/entities/operator.entity");
const notifications_module_1 = require("../notifications/notifications.module");
@(0, common_1.Module)({
    imports: [
        typeorm_1.TypeOrmModule.forFeature([booking_entity_1.Booking, terminal_entity_1.Terminal, truck_entity_1.Truck, driver_entity_1.Driver, carrier_entity_1.Carrier, operator_entity_1.Operator]),
        notifications_module_1.NotificationsModule,
    ],
    controllers: [bookings_controller_1.BookingsController],
    providers: [bookings_service_1.BookingsService],
    exports: [bookings_service_1.BookingsService],
})
class BookingsModule {
}
exports.BookingsModule = BookingsModule;
