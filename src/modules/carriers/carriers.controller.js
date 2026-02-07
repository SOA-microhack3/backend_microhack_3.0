"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarriersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const guards_1 = require("../../common/guards");
const decorators_1 = require("../../common/decorators");
const enums_1 = require("../../common/enums");
@(0, swagger_1.ApiTags)('Carriers')
@(0, swagger_1.ApiBearerAuth)()
@(0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard)
@(0, common_1.Controller)('carriers')
class CarriersController {
    carriersService;
    constructor(carriersService) {
        this.carriersService = carriersService;
    }
    @(0, common_1.Get)()
    @(0, swagger_1.ApiOperation)({ summary: 'Get all carriers' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'List of carriers', type: [dto_1.CarrierResponseDto] })
    async findAll() {
        return this.carriersService.findAll();
    }
    @(0, common_1.Get)('me')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Get current carrier profile' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Carrier found', type: dto_1.CarrierResponseDto })
    async getMe(
    @(0, decorators_1.CurrentUser)('id')
    userId) {
        return this.carriersService.findByUserIdDto(userId);
    }
    @(0, common_1.Get)(':id')
    @(0, swagger_1.ApiOperation)({ summary: 'Get carrier by ID' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Carrier found', type: dto_1.CarrierResponseDto })
    async findOne(
    @(0, common_1.Param)('id')
    id) {
        return this.carriersService.findOne(id);
    }
    @(0, common_1.Get)(':id/trucks')
    @(0, swagger_1.ApiOperation)({ summary: 'Get carrier\'s trucks' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'List of trucks' })
    async getTrucks(
    @(0, common_1.Param)('id')
    id) {
        return this.carriersService.getTrucks(id);
    }
    @(0, common_1.Get)(':id/drivers')
    @(0, swagger_1.ApiOperation)({ summary: 'Get carrier\'s drivers' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'List of drivers' })
    async getDrivers(
    @(0, common_1.Param)('id')
    id) {
        return this.carriersService.getDrivers(id);
    }
    @(0, common_1.Post)()
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN)
    @(0, swagger_1.ApiOperation)({ summary: 'Create a new carrier (Admin only)' })
    @(0, swagger_1.ApiResponse)({ status: 201, description: 'Carrier created', type: dto_1.CarrierResponseDto })
    async create(
    @(0, common_1.Body)()
    createCarrierDto) {
        return this.carriersService.create(createCarrierDto);
    }
    @(0, common_1.Put)(':id')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Update carrier' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Carrier updated', type: dto_1.CarrierResponseDto })
    async update(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)()
    updateCarrierDto) {
        return this.carriersService.update(id, updateCarrierDto);
    }
}
exports.CarriersController = CarriersController;
