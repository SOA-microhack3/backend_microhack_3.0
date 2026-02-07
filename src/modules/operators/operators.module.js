"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const operators_controller_1 = require("./operators.controller");
const operators_service_1 = require("./operators.service");
const operator_entity_1 = require("./entities/operator.entity");
@(0, common_1.Module)({
    imports: [typeorm_1.TypeOrmModule.forFeature([operator_entity_1.Operator])],
    controllers: [operators_controller_1.OperatorsController],
    providers: [operators_service_1.OperatorsService],
    exports: [operators_service_1.OperatorsService],
})
class OperatorsModule {
}
exports.OperatorsModule = OperatorsModule;
