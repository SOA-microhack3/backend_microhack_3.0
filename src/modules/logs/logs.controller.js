"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const guards_1 = require("../../common/guards");
const decorators_1 = require("../../common/decorators");
const enums_1 = require("../../common/enums");
@(0, swagger_1.ApiTags)('Logs')
@(0, swagger_1.ApiBearerAuth)()
@(0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard)
@(0, common_1.Controller)('logs')
class LogsController {
    logsService;
    constructor(logsService) {
        this.logsService = logsService;
    }
    @(0, common_1.Get)()
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN)
    @(0, swagger_1.ApiOperation)({ summary: 'Get all logs (Admin only)' })
    @(0, swagger_1.ApiQuery)({ name: 'entityType', enum: enums_1.EntityType, required: false })
    @(0, swagger_1.ApiQuery)({ name: 'action', enum: enums_1.LogAction, required: false })
    @(0, swagger_1.ApiQuery)({ name: 'actorId', required: false })
    @(0, swagger_1.ApiResponse)({ status: 200, type: [dto_1.LogResponseDto] })
    async findAll(
    @(0, common_1.Query)()
    filters) {
        return this.logsService.findAll(filters);
    }
    @(0, common_1.Get)('entity/:type/:id')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN)
    @(0, swagger_1.ApiOperation)({ summary: 'Get logs for specific entity' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: [dto_1.LogResponseDto] })
    async findByEntity(
    @(0, common_1.Param)('type')
    type, 
    @(0, common_1.Param)('id')
    id) {
        return this.logsService.findByEntity(type, id);
    }
}
exports.LogsController = LogsController;
