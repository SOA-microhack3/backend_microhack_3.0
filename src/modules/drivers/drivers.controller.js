"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriversController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const guards_1 = require("../../common/guards");
const decorators_1 = require("../../common/decorators");
const enums_1 = require("../../common/enums");
@(0, swagger_1.ApiTags)('Drivers')
@(0, swagger_1.ApiBearerAuth)()
@(0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard)
@(0, common_1.Controller)('drivers')
class DriversController {
    driversService;
    constructor(driversService) {
        this.driversService = driversService;
    }
    @(0, common_1.Get)()
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Get all drivers (filtered by carrier)' })
    @(0, swagger_1.ApiQuery)({ name: 'carrierId', required: false })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'List of drivers', type: [dto_1.DriverResponseDto] })
    async findAll(
    @(0, common_1.Query)('carrierId')
    carrierId) {
        return this.driversService.findAll(carrierId);
    }
    @(0, common_1.Get)('me')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.DRIVER)
    @(0, swagger_1.ApiOperation)({ summary: 'Get current driver profile' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Driver found', type: dto_1.DriverResponseDto })
    async getMe(
    @(0, decorators_1.CurrentUser)('id')
    userId) {
        return this.driversService.findByUserIdDto(userId);
    }
    @(0, common_1.Get)(':id')
    @(0, swagger_1.ApiOperation)({ summary: 'Get driver by ID' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Driver found', type: dto_1.DriverResponseDto })
    async findOne(
    @(0, common_1.Param)('id')
    id) {
        return this.driversService.findOne(id);
    }
    @(0, common_1.Post)()
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Create a new driver' })
    @(0, swagger_1.ApiResponse)({ status: 201, description: 'Driver created', type: dto_1.DriverResponseDto })
    async create(
    @(0, common_1.Body)()
    createDriverDto) {
        return this.driversService.create(createDriverDto);
    }
    @(0, common_1.Patch)(':id/status')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Update driver status' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Status updated', type: dto_1.DriverResponseDto })
    async updateStatus(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)()
    updateDriverStatusDto) {
        return this.driversService.updateStatus(id, updateDriverStatusDto);
    }
}
exports.DriversController = DriversController;
