"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResponseDto = exports.ResetPasswordDto = exports.ForgotPasswordDto = exports.RefreshTokenDto = exports.LoginDto = exports.RegisterDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
class RegisterDto {
    @(0, swagger_1.ApiProperty)({ example: 'John Doe' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsNotEmpty)()
    fullName;
    @(0, swagger_1.ApiProperty)({ example: 'john@example.com' })
    @(0, class_validator_1.IsEmail)()
    email;
    @(0, swagger_1.ApiProperty)({ example: 'password123', minLength: 6 })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.MinLength)(6)
    password;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.UserRole, example: enums_1.UserRole.CARRIER })
    @(0, class_validator_1.IsEnum)(enums_1.UserRole)
    role;
}
exports.RegisterDto = RegisterDto;
class LoginDto {
    @(0, swagger_1.ApiProperty)({ example: 'john@example.com' })
    @(0, class_validator_1.IsEmail)()
    email;
    @(0, swagger_1.ApiProperty)({ example: 'password123' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsNotEmpty)()
    password;
}
exports.LoginDto = LoginDto;
class RefreshTokenDto {
    @(0, swagger_1.ApiProperty)()
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsNotEmpty)()
    refreshToken;
}
exports.RefreshTokenDto = RefreshTokenDto;
class ForgotPasswordDto {
    @(0, swagger_1.ApiProperty)({ example: 'john@example.com' })
    @(0, class_validator_1.IsEmail)()
    email;
}
exports.ForgotPasswordDto = ForgotPasswordDto;
class ResetPasswordDto {
    @(0, swagger_1.ApiProperty)()
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsNotEmpty)()
    token;
    @(0, swagger_1.ApiProperty)({ minLength: 6 })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.MinLength)(6)
    newPassword;
}
exports.ResetPasswordDto = ResetPasswordDto;
class AuthResponseDto {
    @(0, swagger_1.ApiProperty)()
    accessToken;
    @(0, swagger_1.ApiProperty)()
    refreshToken;
    @(0, swagger_1.ApiProperty)()
    user;
}
exports.AuthResponseDto = AuthResponseDto;
