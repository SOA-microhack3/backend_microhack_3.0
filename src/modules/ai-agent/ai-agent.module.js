"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAgentModule = void 0;
const common_1 = require("@nestjs/common");
const ai_agent_controller_1 = require("./ai-agent.controller");
const ai_agent_service_1 = require("./ai-agent.service");
const users_module_1 = require("../users/users.module");
const bookings_module_1 = require("../bookings/bookings.module");
const carriers_module_1 = require("../carriers/carriers.module");
const operators_module_1 = require("../operators/operators.module");
const terminals_module_1 = require("../terminals/terminals.module");
@(0, common_1.Module)({
    imports: [users_module_1.UsersModule, bookings_module_1.BookingsModule, carriers_module_1.CarriersModule, operators_module_1.OperatorsModule, terminals_module_1.TerminalsModule],
    controllers: [ai_agent_controller_1.AiAgentController],
    providers: [ai_agent_service_1.AiAgentService],
})
class AiAgentModule {
}
exports.AiAgentModule = AiAgentModule;
