"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const decorators_1 = require("../../common/decorators");
const guards_1 = require("../../common/guards");
const enums_1 = require("../../common/enums");
@(0, swagger_1.ApiTags)('Authentication')
@(0, common_1.Controller)('auth')
class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    @(0, common_1.Post)('register')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiBearerAuth)()
    @(0, swagger_1.ApiOperation)({ summary: 'Register a new user' })
    @(0, swagger_1.ApiResponse)({ status: 201, description: 'User registered successfully', type: dto_1.AuthResponseDto })
    @(0, swagger_1.ApiResponse)({ status: 409, description: 'Email already registered' })
    async register(
    @(0, common_1.Body)()
    registerDto, 
    @(0, decorators_1.CurrentUser)()
    user) {
        if (user?.role === enums_1.UserRole.CARRIER && registerDto.role !== enums_1.UserRole.DRIVER) {
            throw new common_1.ForbiddenException('Carriers can only create drivers');
        }
        return this.authService.register(registerDto);
    }
    @(0, decorators_1.Public)()
    @(0, common_1.Post)('login')
    @(0, common_1.HttpCode)(common_1.HttpStatus.OK)
    @(0, swagger_1.ApiOperation)({ summary: 'Login with email and password' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful', type: dto_1.AuthResponseDto })
    @(0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' })
    async login(
    @(0, common_1.Body)()
    loginDto) {
        return this.authService.login(loginDto);
    }
    @(0, decorators_1.Public)()
    @(0, common_1.Post)('refresh-token')
    @(0, common_1.HttpCode)(common_1.HttpStatus.OK)
    @(0, swagger_1.ApiOperation)({ summary: 'Refresh access token' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Token refreshed successfully', type: dto_1.AuthResponseDto })
    @(0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid refresh token' })
    async refreshToken(
    @(0, common_1.Body)()
    refreshTokenDto) {
        return this.authService.refreshToken(refreshTokenDto);
    }
    @(0, common_1.UseGuards)(guards_1.JwtAuthGuard)
    @(0, common_1.Post)('logout')
    @(0, common_1.HttpCode)(common_1.HttpStatus.OK)
    @(0, swagger_1.ApiBearerAuth)()
    @(0, swagger_1.ApiOperation)({ summary: 'Logout current user' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Logout successful' })
    async logout(
    @(0, common_1.Req)()
    req) {
        await this.authService.logout(req.user.id);
        return { message: 'Logged out successfully' };
    }
    @(0, decorators_1.Public)()
    @(0, common_1.Post)('forgot-password')
    @(0, common_1.HttpCode)(common_1.HttpStatus.OK)
    @(0, swagger_1.ApiOperation)({ summary: 'Request password reset' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Reset link sent if email exists' })
    async forgotPassword(
    @(0, common_1.Body)()
    forgotPasswordDto) {
        return this.authService.forgotPassword(forgotPasswordDto);
    }
    @(0, decorators_1.Public)()
    @(0, common_1.Post)('reset-password')
    @(0, common_1.HttpCode)(common_1.HttpStatus.OK)
    @(0, swagger_1.ApiOperation)({ summary: 'Reset password with token' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Password reset successful' })
    @(0, swagger_1.ApiResponse)({ status: 400, description: 'Invalid or expired token' })
    async resetPassword(
    @(0, common_1.Body)()
    resetPasswordDto) {
        return this.authService.resetPassword(resetPasswordDto);
    }
}
exports.AuthController = AuthController;
