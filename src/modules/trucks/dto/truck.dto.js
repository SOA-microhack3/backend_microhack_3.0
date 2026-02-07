"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TruckResponseDto = exports.UpdateTruckStatusDto = exports.UpdateTruckDto = exports.CreateTruckDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
class CreateTruckDto {
    @(0, swagger_1.ApiProperty)({ example: 'ABC-1234' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsNotEmpty)()
    plateNumber;
    @(0, swagger_1.ApiProperty)({ description: 'Carrier ID' })
    @(0, class_validator_1.IsUUID)()
    carrierId;
}
exports.CreateTruckDto = CreateTruckDto;
class UpdateTruckDto {
    @(0, swagger_1.ApiPropertyOptional)({ example: 'ABC-1234' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsOptional)()
    plateNumber;
}
exports.UpdateTruckDto = UpdateTruckDto;
class UpdateTruckStatusDto {
    @(0, swagger_1.ApiProperty)({ enum: enums_1.TruckStatus })
    @(0, class_validator_1.IsEnum)(enums_1.TruckStatus)
    status;
}
exports.UpdateTruckStatusDto = UpdateTruckStatusDto;
class TruckResponseDto {
    @(0, swagger_1.ApiProperty)()
    id;
    @(0, swagger_1.ApiProperty)()
    plateNumber;
    @(0, swagger_1.ApiProperty)()
    carrierId;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.TruckStatus })
    status;
    @(0, swagger_1.ApiProperty)()
    createdAt;
}
exports.TruckResponseDto = TruckResponseDto;
