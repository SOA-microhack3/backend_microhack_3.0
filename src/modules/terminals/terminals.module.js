"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const terminals_controller_1 = require("./terminals.controller");
const terminals_service_1 = require("./terminals.service");
const terminal_entity_1 = require("./entities/terminal.entity");
const booking_entity_1 = require("../bookings/entities/booking.entity");
const port_entity_1 = require("../ports/entities/port.entity");
@(0, common_1.Module)({
    imports: [typeorm_1.TypeOrmModule.forFeature([terminal_entity_1.Terminal, booking_entity_1.Booking, port_entity_1.Port])],
    controllers: [terminals_controller_1.TerminalsController],
    providers: [terminals_service_1.TerminalsService],
    exports: [terminals_service_1.TerminalsService],
})
class TerminalsModule {
}
exports.TerminalsModule = TerminalsModule;
