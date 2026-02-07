"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorResponseDto = exports.UpdateOperatorStatusDto = exports.CreateOperatorDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
class CreateOperatorDto {
    @(0, swagger_1.ApiProperty)({ description: 'User ID' })
    @(0, class_validator_1.IsUUID)()
    userId;
    @(0, swagger_1.ApiProperty)({ description: 'Port ID' })
    @(0, class_validator_1.IsUUID)()
    portId;
    @(0, swagger_1.ApiProperty)({ description: 'Terminal ID' })
    @(0, class_validator_1.IsUUID)()
    terminalId;
}
exports.CreateOperatorDto = CreateOperatorDto;
class UpdateOperatorStatusDto {
    @(0, swagger_1.ApiProperty)({ enum: enums_1.OperatorStatus })
    @(0, class_validator_1.IsEnum)(enums_1.OperatorStatus)
    status;
}
exports.UpdateOperatorStatusDto = UpdateOperatorStatusDto;
class OperatorResponseDto {
    @(0, swagger_1.ApiProperty)()
    id;
    @(0, swagger_1.ApiProperty)()
    userId;
    @(0, swagger_1.ApiProperty)()
    portId;
    @(0, swagger_1.ApiProperty)()
    terminalId;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.OperatorStatus })
    status;
    @(0, swagger_1.ApiProperty)()
    createdAt;
}
exports.OperatorResponseDto = OperatorResponseDto;
