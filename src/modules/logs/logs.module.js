"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const logs_controller_1 = require("./logs.controller");
const logs_service_1 = require("./logs.service");
const log_entity_1 = require("./entities/log.entity");
@(0, common_1.Module)({
    imports: [typeorm_1.TypeOrmModule.forFeature([log_entity_1.Log])],
    controllers: [logs_controller_1.LogsController],
    providers: [logs_service_1.LogsService],
    exports: [logs_service_1.LogsService],
})
class LogsModule {
}
exports.LogsModule = LogsModule;
