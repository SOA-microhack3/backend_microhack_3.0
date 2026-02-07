"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarriersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const carriers_controller_1 = require("./carriers.controller");
const carriers_service_1 = require("./carriers.service");
const carrier_entity_1 = require("./entities/carrier.entity");
@(0, common_1.Module)({
    imports: [typeorm_1.TypeOrmModule.forFeature([carrier_entity_1.Carrier])],
    controllers: [carriers_controller_1.CarriersController],
    providers: [carriers_service_1.CarriersService],
    exports: [carriers_service_1.CarriersService],
})
class CarriersModule {
}
exports.CarriersModule = CarriersModule;
