"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationResponseDto = exports.MarkReadDto = exports.CreateNotificationDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const enums_1 = require("../../../common/enums");
class CreateNotificationDto {
    @(0, swagger_1.ApiProperty)()
    @(0, class_validator_1.IsUUID)()
    userId;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.NotificationType })
    @(0, class_validator_1.IsEnum)(enums_1.NotificationType)
    type;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.NotificationSource })
    @(0, class_validator_1.IsEnum)(enums_1.NotificationSource)
    source;
    @(0, swagger_1.ApiProperty)()
    @(0, class_validator_1.IsString)()
    message;
}
exports.CreateNotificationDto = CreateNotificationDto;
class MarkReadDto {
    @(0, swagger_1.ApiProperty)({ type: [String] })
    @(0, class_validator_1.IsArray)()
    @(0, class_validator_1.IsUUID)('all', { each: true })
    notificationIds;
}
exports.MarkReadDto = MarkReadDto;
class NotificationResponseDto {
    @(0, swagger_1.ApiProperty)()
    id;
    @(0, swagger_1.ApiProperty)()
    userId;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.NotificationType })
    type;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.NotificationSource })
    source;
    @(0, swagger_1.ApiProperty)()
    message;
    @(0, swagger_1.ApiPropertyOptional)()
    readAt;
    @(0, swagger_1.ApiProperty)()
    createdAt;
}
exports.NotificationResponseDto = NotificationResponseDto;
