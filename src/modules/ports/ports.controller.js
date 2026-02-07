"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const guards_1 = require("../../common/guards");
const decorators_1 = require("../../common/decorators");
const enums_1 = require("../../common/enums");
@(0, swagger_1.ApiTags)('Ports')
@(0, swagger_1.ApiBearerAuth)()
@(0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard)
@(0, common_1.Controller)('ports')
class PortsController {
    portsService;
    constructor(portsService) {
        this.portsService = portsService;
    }
    @(0, common_1.Get)()
    @(0, swagger_1.ApiOperation)({ summary: 'Get all ports' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'List of ports', type: [dto_1.PortResponseDto] })
    async findAll() {
        return this.portsService.findAll();
    }
    @(0, common_1.Get)(':id')
    @(0, swagger_1.ApiOperation)({ summary: 'Get port by ID' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Port found', type: dto_1.PortResponseDto })
    @(0, swagger_1.ApiResponse)({ status: 404, description: 'Port not found' })
    async findOne(
    @(0, common_1.Param)('id')
    id) {
        return this.portsService.findOne(id);
    }
    @(0, common_1.Get)(':id/terminals')
    @(0, swagger_1.ApiOperation)({ summary: 'Get terminals for a port' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'List of terminals' })
    async getTerminals(
    @(0, common_1.Param)('id')
    id) {
        return this.portsService.getTerminals(id);
    }
    @(0, common_1.Post)()
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN)
    @(0, swagger_1.ApiOperation)({ summary: 'Create a new port (Admin only)' })
    @(0, swagger_1.ApiResponse)({ status: 201, description: 'Port created', type: dto_1.PortResponseDto })
    async create(
    @(0, common_1.Body)()
    createPortDto) {
        return this.portsService.create(createPortDto);
    }
    @(0, common_1.Put)(':id')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN)
    @(0, swagger_1.ApiOperation)({ summary: 'Update port (Admin only)' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Port updated', type: dto_1.PortResponseDto })
    async update(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)()
    updatePortDto) {
        return this.portsService.update(id, updatePortDto);
    }
    @(0, common_1.Delete)(':id')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN)
    @(0, swagger_1.ApiOperation)({ summary: 'Delete port (Admin only)' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Port deleted' })
    async remove(
    @(0, common_1.Param)('id')
    id) {
        await this.portsService.remove(id);
        return { message: 'Port deleted successfully' };
    }
}
exports.PortsController = PortsController;
