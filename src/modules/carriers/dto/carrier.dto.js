"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarrierResponseDto = exports.UpdateCarrierDto = exports.CreateCarrierDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateCarrierDto {
    @(0, swagger_1.ApiProperty)({ example: 'ABC Logistics' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsNotEmpty)()
    name;
    @(0, swagger_1.ApiProperty)({ description: 'User ID to associate with carrier' })
    @(0, class_validator_1.IsUUID)()
    userId;
}
exports.CreateCarrierDto = CreateCarrierDto;
class UpdateCarrierDto {
    @(0, swagger_1.ApiPropertyOptional)({ example: 'ABC Logistics' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsOptional)()
    name;
}
exports.UpdateCarrierDto = UpdateCarrierDto;
class CarrierResponseDto {
    @(0, swagger_1.ApiProperty)()
    id;
    @(0, swagger_1.ApiProperty)()
    name;
    @(0, swagger_1.ApiProperty)()
    userId;
    @(0, swagger_1.ApiProperty)()
    createdAt;
}
exports.CarrierResponseDto = CarrierResponseDto;
