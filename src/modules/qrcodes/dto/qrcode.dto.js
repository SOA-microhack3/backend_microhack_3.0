"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrValidationResultDto = exports.QrCodeResponseDto = exports.ScanQrCodeDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
class ScanQrCodeDto {
    @(0, swagger_1.ApiProperty)({ description: 'JWT token from QR code' })
    @(0, class_validator_1.IsString)()
    token;
}
exports.ScanQrCodeDto = ScanQrCodeDto;
class QrCodeResponseDto {
    @(0, swagger_1.ApiProperty)()
    id;
    @(0, swagger_1.ApiProperty)()
    bookingId;
    @(0, swagger_1.ApiProperty)()
    jwtToken;
    @(0, swagger_1.ApiProperty)()
    qrCodeData;
    @(0, swagger_1.ApiProperty)()
    expiresAt;
    @(0, swagger_1.ApiPropertyOptional)()
    usedAt;
    @(0, swagger_1.ApiPropertyOptional)()
    pathId;
    @(0, swagger_1.ApiProperty)()
    createdAt;
}
exports.QrCodeResponseDto = QrCodeResponseDto;
class QrValidationResultDto {
    @(0, swagger_1.ApiProperty)()
    valid;
    @(0, swagger_1.ApiProperty)()
    message;
    @(0, swagger_1.ApiPropertyOptional)()
    booking;
}
exports.QrValidationResultDto = QrValidationResultDto;
