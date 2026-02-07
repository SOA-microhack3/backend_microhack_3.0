"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const ai_controller_1 = require("./ai.controller");
const ai_service_1 = require("./ai.service");
const booking_entity_1 = require("../bookings/entities/booking.entity");
const terminal_entity_1 = require("../terminals/entities/terminal.entity");
const carrier_entity_1 = require("../carriers/entities/carrier.entity");
@(0, common_1.Module)({
    imports: [typeorm_1.TypeOrmModule.forFeature([booking_entity_1.Booking, terminal_entity_1.Terminal, carrier_entity_1.Carrier])],
    controllers: [ai_controller_1.AiController],
    providers: [ai_service_1.AiService],
})
class AiModule {
}
exports.AiModule = AiModule;
