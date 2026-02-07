"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriverResponseDto = exports.UpdateDriverStatusDto = exports.CreateDriverDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
class CreateDriverDto {
    @(0, swagger_1.ApiProperty)({ description: 'User ID to associate with driver' })
    @(0, class_validator_1.IsUUID)()
    userId;
    @(0, swagger_1.ApiProperty)({ description: 'Carrier ID' })
    @(0, class_validator_1.IsUUID)()
    carrierId;
}
exports.CreateDriverDto = CreateDriverDto;
class UpdateDriverStatusDto {
    @(0, swagger_1.ApiProperty)({ enum: enums_1.DriverStatus })
    @(0, class_validator_1.IsEnum)(enums_1.DriverStatus)
    status;
}
exports.UpdateDriverStatusDto = UpdateDriverStatusDto;
class DriverResponseDto {
    @(0, swagger_1.ApiProperty)()
    id;
    @(0, swagger_1.ApiProperty)()
    userId;
    @(0, swagger_1.ApiProperty)()
    carrierId;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.DriverStatus })
    status;
    @(0, swagger_1.ApiProperty)()
    createdAt;
    @(0, swagger_1.ApiPropertyOptional)()
    user;
}
exports.DriverResponseDto = DriverResponseDto;
