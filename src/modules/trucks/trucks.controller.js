"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrucksController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const guards_1 = require("../../common/guards");
const decorators_1 = require("../../common/decorators");
const enums_1 = require("../../common/enums");
@(0, swagger_1.ApiTags)('Trucks')
@(0, swagger_1.ApiBearerAuth)()
@(0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard)
@(0, common_1.Controller)('trucks')
class TrucksController {
    trucksService;
    constructor(trucksService) {
        this.trucksService = trucksService;
    }
    @(0, common_1.Get)()
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Get all trucks (filtered by carrier)' })
    @(0, swagger_1.ApiQuery)({ name: 'carrierId', required: false })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'List of trucks', type: [dto_1.TruckResponseDto] })
    async findAll(
    @(0, common_1.Query)('carrierId')
    carrierId) {
        return this.trucksService.findAll(carrierId);
    }
    @(0, common_1.Get)(':id')
    @(0, swagger_1.ApiOperation)({ summary: 'Get truck by ID' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Truck found', type: dto_1.TruckResponseDto })
    async findOne(
    @(0, common_1.Param)('id')
    id) {
        return this.trucksService.findOne(id);
    }
    @(0, common_1.Get)(':id/availability')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Check when truck is free' })
    @(0, swagger_1.ApiQuery)({ name: 'date', required: false })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Truck availability' })
    async getAvailability(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Query)('date')
    dateStr) {
        const date = dateStr ? new Date(dateStr) : new Date();
        return this.trucksService.getAvailability(id, date);
    }
    @(0, common_1.Post)()
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Register a new truck' })
    @(0, swagger_1.ApiResponse)({ status: 201, description: 'Truck created', type: dto_1.TruckResponseDto })
    async create(
    @(0, common_1.Body)()
    createTruckDto) {
        return this.trucksService.create(createTruckDto);
    }
    @(0, common_1.Put)(':id')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Update truck' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Truck updated', type: dto_1.TruckResponseDto })
    async update(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)()
    updateTruckDto) {
        return this.trucksService.update(id, updateTruckDto);
    }
    @(0, common_1.Patch)(':id/status')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Update truck status (activate/suspend)' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated', type: dto_1.TruckResponseDto })
    async updateStatus(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)()
    updateTruckStatusDto) {
        return this.trucksService.updateStatus(id, updateTruckStatusDto);
    }
}
exports.TrucksController = TrucksController;
