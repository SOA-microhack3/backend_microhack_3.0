"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ports_controller_1 = require("./ports.controller");
const ports_service_1 = require("./ports.service");
const port_entity_1 = require("./entities/port.entity");
@(0, common_1.Module)({
    imports: [typeorm_1.TypeOrmModule.forFeature([port_entity_1.Port])],
    controllers: [ports_controller_1.PortsController],
    providers: [ports_service_1.PortsService],
    exports: [ports_service_1.PortsService],
})
class PortsModule {
}
exports.PortsModule = PortsModule;
