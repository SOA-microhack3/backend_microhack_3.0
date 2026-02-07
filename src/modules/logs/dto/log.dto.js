"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogFilterDto = exports.LogResponseDto = exports.CreateLogDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
class CreateLogDto {
    @(0, swagger_1.ApiPropertyOptional)()
    @(0, class_validator_1.IsUUID)()
    @(0, class_validator_1.IsOptional)()
    organizationId;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.ActorType })
    @(0, class_validator_1.IsEnum)(enums_1.ActorType)
    actorType;
    @(0, swagger_1.ApiPropertyOptional)()
    @(0, class_validator_1.IsUUID)()
    @(0, class_validator_1.IsOptional)()
    actorId;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.EntityType })
    @(0, class_validator_1.IsEnum)(enums_1.EntityType)
    entityType;
    @(0, swagger_1.ApiProperty)()
    @(0, class_validator_1.IsUUID)()
    entityId;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.LogAction })
    @(0, class_validator_1.IsEnum)(enums_1.LogAction)
    action;
    @(0, swagger_1.ApiProperty)()
    @(0, class_validator_1.IsString)()
    description;
}
exports.CreateLogDto = CreateLogDto;
class LogResponseDto {
    @(0, swagger_1.ApiProperty)()
    id;
    @(0, swagger_1.ApiPropertyOptional)()
    organizationId;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.ActorType })
    actorType;
    @(0, swagger_1.ApiPropertyOptional)()
    actorId;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.EntityType })
    entityType;
    @(0, swagger_1.ApiProperty)()
    entityId;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.LogAction })
    action;
    @(0, swagger_1.ApiProperty)()
    description;
    @(0, swagger_1.ApiProperty)()
    createdAt;
}
exports.LogResponseDto = LogResponseDto;
class LogFilterDto {
    @(0, swagger_1.ApiPropertyOptional)({ enum: enums_1.EntityType })
    @(0, class_validator_1.IsEnum)(enums_1.EntityType)
    @(0, class_validator_1.IsOptional)()
    entityType;
    @(0, swagger_1.ApiPropertyOptional)({ enum: enums_1.LogAction })
    @(0, class_validator_1.IsEnum)(enums_1.LogAction)
    @(0, class_validator_1.IsOptional)()
    action;
    @(0, swagger_1.ApiPropertyOptional)()
    @(0, class_validator_1.IsUUID)()
    @(0, class_validator_1.IsOptional)()
    actorId;
}
exports.LogFilterDto = LogFilterDto;
