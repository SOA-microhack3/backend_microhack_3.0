"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrucksModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const trucks_controller_1 = require("./trucks.controller");
const trucks_service_1 = require("./trucks.service");
const truck_entity_1 = require("./entities/truck.entity");
const booking_entity_1 = require("../bookings/entities/booking.entity");
@(0, common_1.Module)({
    imports: [typeorm_1.TypeOrmModule.forFeature([truck_entity_1.Truck, booking_entity_1.Booking])],
    controllers: [trucks_controller_1.TrucksController],
    providers: [trucks_service_1.TrucksService],
    exports: [trucks_service_1.TrucksService],
})
class TrucksModule {
}
exports.TrucksModule = TrucksModule;
