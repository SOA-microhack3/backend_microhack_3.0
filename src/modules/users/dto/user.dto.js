"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResponseDto = exports.UpdateUserDto = exports.CreateUserDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
class CreateUserDto {
    @(0, swagger_1.ApiProperty)({ example: 'John Doe' })
    @(0, class_validator_1.IsString)()
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
exports.CreateUserDto = CreateUserDto;
class UpdateUserDto {
    @(0, swagger_1.ApiPropertyOptional)({ example: 'John Doe' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsOptional)()
    fullName;
    @(0, swagger_1.ApiPropertyOptional)({ example: 'john@example.com' })
    @(0, class_validator_1.IsEmail)()
    @(0, class_validator_1.IsOptional)()
    email;
    @(0, swagger_1.ApiPropertyOptional)({ enum: enums_1.UserRole })
    @(0, class_validator_1.IsEnum)(enums_1.UserRole)
    @(0, class_validator_1.IsOptional)()
    role;
}
exports.UpdateUserDto = UpdateUserDto;
class UserResponseDto {
    @(0, swagger_1.ApiProperty)()
    id;
    @(0, swagger_1.ApiProperty)()
    fullName;
    @(0, swagger_1.ApiProperty)()
    email;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.UserRole })
    role;
    @(0, swagger_1.ApiProperty)()
    createdAt;
}
exports.UserResponseDto = UserResponseDto;
