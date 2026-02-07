"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const guards_1 = require("../../common/guards");
const decorators_1 = require("../../common/decorators");
const enums_1 = require("../../common/enums");
@(0, swagger_1.ApiTags)('Users')
@(0, swagger_1.ApiBearerAuth)()
@(0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard)
@(0, common_1.Controller)('users')
class UsersController {
    usersService;
    constructor(usersService) {
        this.usersService = usersService;
    }
    @(0, common_1.Get)()
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN)
    @(0, swagger_1.ApiOperation)({ summary: 'Get all users (Admin only)' })
    @(0, swagger_1.ApiQuery)({ name: 'role', enum: enums_1.UserRole, required: false })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'List of users', type: [dto_1.UserResponseDto] })
    async findAll(
    @(0, common_1.Query)('role')
    role) {
        return this.usersService.findAll(role);
    }
    @(0, common_1.Get)('me')
    @(0, swagger_1.ApiOperation)({ summary: 'Get current user profile' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Current user profile', type: dto_1.UserResponseDto })
    async getMe(
    @(0, decorators_1.CurrentUser)('id')
    userId) {
        return this.usersService.findOne(userId);
    }
    @(0, common_1.Get)(':id')
    @(0, swagger_1.ApiOperation)({ summary: 'Get user by ID' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'User found', type: dto_1.UserResponseDto })
    @(0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' })
    async findOne(
    @(0, common_1.Param)('id')
    id) {
        return this.usersService.findOne(id);
    }
    @(0, common_1.Post)()
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN)
    @(0, swagger_1.ApiOperation)({ summary: 'Create a new user (Admin only)' })
    @(0, swagger_1.ApiResponse)({ status: 201, description: 'User created', type: dto_1.UserResponseDto })
    @(0, swagger_1.ApiResponse)({ status: 409, description: 'Email already registered' })
    async create(
    @(0, common_1.Body)()
    createUserDto) {
        return this.usersService.create(createUserDto);
    }
    @(0, common_1.Put)(':id')
    @(0, swagger_1.ApiOperation)({ summary: 'Update user' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'User updated', type: dto_1.UserResponseDto })
    @(0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' })
    async update(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)()
    updateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    @(0, common_1.Delete)(':id')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN)
    @(0, swagger_1.ApiOperation)({ summary: 'Delete user (Admin only)' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'User deleted' })
    @(0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' })
    async remove(
    @(0, common_1.Param)('id')
    id) {
        await this.usersService.remove(id);
        return { message: 'User deleted successfully' };
    }
}
exports.UsersController = UsersController;
