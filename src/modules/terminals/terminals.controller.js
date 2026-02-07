"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const guards_1 = require("../../common/guards");
const decorators_1 = require("../../common/decorators");
const enums_1 = require("../../common/enums");
@(0, swagger_1.ApiTags)('Terminals')
@(0, swagger_1.ApiBearerAuth)()
@(0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard)
@(0, common_1.Controller)('terminals')
class TerminalsController {
    terminalsService;
    constructor(terminalsService) {
        this.terminalsService = terminalsService;
    }
    @(0, common_1.Get)()
    @(0, swagger_1.ApiOperation)({ summary: 'Get all terminals' })
    @(0, swagger_1.ApiQuery)({ name: 'portId', required: false })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'List of terminals', type: [dto_1.TerminalResponseDto] })
    async findAll(
    @(0, common_1.Query)('portId')
    portId) {
        return this.terminalsService.findAll(portId);
    }
    @(0, common_1.Get)(':id')
    @(0, swagger_1.ApiOperation)({ summary: 'Get terminal by ID' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Terminal found', type: dto_1.TerminalResponseDto })
    async findOne(
    @(0, common_1.Param)('id')
    id) {
        return this.terminalsService.findOne(id);
    }
    @(0, common_1.Get)(':id/capacity')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR)
    @(0, swagger_1.ApiOperation)({ summary: 'Get terminal capacity for a date' })
    @(0, swagger_1.ApiQuery)({ name: 'date', required: false, description: 'Date in ISO format' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Terminal capacity', type: dto_1.TerminalCapacityDto })
    async getCapacity(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Query)('date')
    dateStr) {
        const date = dateStr ? new Date(dateStr) : new Date();
        return this.terminalsService.getCapacity(id, date);
    }
    @(0, common_1.Get)(':id/bookings')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR)
    @(0, swagger_1.ApiOperation)({ summary: 'Get today\'s bookings for terminal' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'List of bookings' })
    async getTodayBookings(
    @(0, common_1.Param)('id')
    id) {
        return this.terminalsService.getTodayBookings(id);
    }
    @(0, common_1.Post)()
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN)
    @(0, swagger_1.ApiOperation)({ summary: 'Create a new terminal (Admin only)' })
    @(0, swagger_1.ApiResponse)({ status: 201, description: 'Terminal created', type: dto_1.TerminalResponseDto })
    async create(
    @(0, common_1.Body)()
    createTerminalDto) {
        return this.terminalsService.create(createTerminalDto);
    }
    @(0, common_1.Put)(':id')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR)
    @(0, swagger_1.ApiOperation)({ summary: 'Update terminal capacity' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Terminal updated', type: dto_1.TerminalResponseDto })
    async update(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)()
    updateTerminalDto) {
        return this.terminalsService.update(id, updateTerminalDto);
    }
}
exports.TerminalsController = TerminalsController;
