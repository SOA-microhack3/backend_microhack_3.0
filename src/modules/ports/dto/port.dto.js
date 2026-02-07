"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortResponseDto = exports.UpdatePortDto = exports.CreatePortDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreatePortDto {
    @(0, swagger_1.ApiProperty)({ example: 'Port of Algiers' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsNotEmpty)()
    name;
    @(0, swagger_1.ApiProperty)({ example: 'DZ' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsNotEmpty)()
    countryCode;
    @(0, swagger_1.ApiPropertyOptional)({ example: 'Africa/Algiers', default: 'UTC' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsOptional)()
    timezone;
    @(0, swagger_1.ApiPropertyOptional)({ example: 60, description: 'Slot duration in minutes' })
    @(0, class_validator_1.IsNumber)()
    @(0, class_validator_1.Min)(15)
    @(0, class_validator_1.IsOptional)()
    slotDuration;
}
exports.CreatePortDto = CreatePortDto;
class UpdatePortDto {
    @(0, swagger_1.ApiPropertyOptional)({ example: 'Port of Algiers' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsOptional)()
    name;
    @(0, swagger_1.ApiPropertyOptional)({ example: 'Africa/Algiers' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsOptional)()
    timezone;
    @(0, swagger_1.ApiPropertyOptional)({ example: 60 })
    @(0, class_validator_1.IsNumber)()
    @(0, class_validator_1.Min)(15)
    @(0, class_validator_1.IsOptional)()
    slotDuration;
}
exports.UpdatePortDto = UpdatePortDto;
class PortResponseDto {
    @(0, swagger_1.ApiProperty)()
    id;
    @(0, swagger_1.ApiProperty)()
    name;
    @(0, swagger_1.ApiProperty)()
    countryCode;
    @(0, swagger_1.ApiProperty)()
    timezone;
    @(0, swagger_1.ApiProperty)()
    slotDuration;
    @(0, swagger_1.ApiProperty)()
    createdAt;
}
exports.PortResponseDto = PortResponseDto;
