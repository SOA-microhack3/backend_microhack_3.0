"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const guards_1 = require("../../common/guards");
const decorators_1 = require("../../common/decorators");
const enums_1 = require("../../common/enums");
@(0, swagger_1.ApiTags)('Operators')
@(0, swagger_1.ApiBearerAuth)()
@(0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard)
@(0, common_1.Controller)('operators')
class OperatorsController {
    operatorsService;
    constructor(operatorsService) {
        this.operatorsService = operatorsService;
    }
    @(0, common_1.Get)()
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN)
    @(0, swagger_1.ApiOperation)({ summary: 'Get all operators (Admin only)' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: [dto_1.OperatorResponseDto] })
    async findAll() {
        return this.operatorsService.findAll();
    }
    @(0, common_1.Get)('me')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR)
    @(0, swagger_1.ApiOperation)({ summary: 'Get current operator profile' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: dto_1.OperatorResponseDto })
    async getMe(
    @(0, decorators_1.CurrentUser)('id')
    userId) {
        return this.operatorsService.findByUserIdDto(userId);
    }
    @(0, common_1.Get)(':id')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR)
    @(0, swagger_1.ApiOperation)({ summary: 'Get operator by ID' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: dto_1.OperatorResponseDto })
    async findOne(
    @(0, common_1.Param)('id')
    id) {
        return this.operatorsService.findOne(id);
    }
    @(0, common_1.Post)()
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN)
    @(0, swagger_1.ApiOperation)({ summary: 'Create a new operator (Admin only)' })
    @(0, swagger_1.ApiResponse)({ status: 201, type: dto_1.OperatorResponseDto })
    async create(
    @(0, common_1.Body)()
    createOperatorDto) {
        return this.operatorsService.create(createOperatorDto);
    }
    @(0, common_1.Patch)(':id/status')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN)
    @(0, swagger_1.ApiOperation)({ summary: 'Update operator status (Admin only)' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: dto_1.OperatorResponseDto })
    async updateStatus(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)()
    updateOperatorStatusDto) {
        return this.operatorsService.updateStatus(id, updateOperatorStatusDto);
    }
}
exports.OperatorsController = OperatorsController;
