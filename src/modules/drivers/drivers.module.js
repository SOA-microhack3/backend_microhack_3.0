"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriversModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const drivers_controller_1 = require("./drivers.controller");
const drivers_service_1 = require("./drivers.service");
const driver_entity_1 = require("./entities/driver.entity");
@(0, common_1.Module)({
    imports: [typeorm_1.TypeOrmModule.forFeature([driver_entity_1.Driver])],
    controllers: [drivers_controller_1.DriversController],
    providers: [drivers_service_1.DriversService],
    exports: [drivers_service_1.DriversService],
})
class DriversModule {
}
exports.DriversModule = DriversModule;
