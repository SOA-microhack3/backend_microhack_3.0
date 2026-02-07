"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const dashboard_controller_1 = require("./dashboard.controller");
const dashboard_service_1 = require("./dashboard.service");
const booking_entity_1 = require("../bookings/entities/booking.entity");
const truck_entity_1 = require("../trucks/entities/truck.entity");
const driver_entity_1 = require("../drivers/entities/driver.entity");
@(0, common_1.Module)({
    imports: [typeorm_1.TypeOrmModule.forFeature([booking_entity_1.Booking, truck_entity_1.Truck, driver_entity_1.Driver])],
    controllers: [dashboard_controller_1.DashboardController],
    providers: [dashboard_service_1.DashboardService],
})
class DashboardModule {
}
exports.DashboardModule = DashboardModule;
