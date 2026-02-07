"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SlotCapacityDto = exports.TerminalCapacityDto = exports.TerminalResponseDto = exports.UpdateTerminalDto = exports.CreateTerminalDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class CreateTerminalDto {
    @(0, swagger_1.ApiProperty)({ example: 'Terminal A' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsNotEmpty)()
    name;
    @(0, swagger_1.ApiProperty)({ description: 'Port ID' })
    @(0, class_validator_1.IsUUID)()
    portId;
    @(0, swagger_1.ApiProperty)({ example: 50, description: 'Max trucks per time slot' })
    @(0, class_validator_1.IsNumber)()
    @(0, class_validator_1.Min)(1)
    maxCapacity;
}
exports.CreateTerminalDto = CreateTerminalDto;
class UpdateTerminalDto {
    @(0, swagger_1.ApiPropertyOptional)({ example: 'Terminal A' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.IsOptional)()
    name;
    @(0, swagger_1.ApiPropertyOptional)({ example: 50 })
    @(0, class_validator_1.IsNumber)()
    @(0, class_validator_1.Min)(1)
    @(0, class_validator_1.IsOptional)()
    maxCapacity;
}
exports.UpdateTerminalDto = UpdateTerminalDto;
class TerminalResponseDto {
    @(0, swagger_1.ApiProperty)()
    id;
    @(0, swagger_1.ApiProperty)()
    name;
    @(0, swagger_1.ApiProperty)()
    portId;
    @(0, swagger_1.ApiProperty)()
    maxCapacity;
    @(0, swagger_1.ApiProperty)()
    createdAt;
}
exports.TerminalResponseDto = TerminalResponseDto;
class TerminalCapacityDto {
    @(0, swagger_1.ApiProperty)()
    terminalId;
    @(0, swagger_1.ApiProperty)()
    terminalName;
    @(0, swagger_1.ApiProperty)()
    maxCapacity;
    @(0, swagger_1.ApiProperty)()
    slots;
}
exports.TerminalCapacityDto = TerminalCapacityDto;
class SlotCapacityDto {
    @(0, swagger_1.ApiProperty)()
    slotStart;
    @(0, swagger_1.ApiProperty)()
    slotEnd;
    @(0, swagger_1.ApiProperty)()
    bookedCount;
    @(0, swagger_1.ApiProperty)()
    availableCount;
}
exports.SlotCapacityDto = SlotCapacityDto;
