"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodesController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const guards_1 = require("../../common/guards");
const decorators_1 = require("../../common/decorators");
const enums_1 = require("../../common/enums");
@(0, swagger_1.ApiTags)('QR Codes')
@(0, swagger_1.ApiBearerAuth)()
@(0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard)
@(0, common_1.Controller)('qrcodes')
class QrCodesController {
    qrCodesService;
    constructor(qrCodesService) {
        this.qrCodesService = qrCodesService;
    }
    @(0, common_1.Post)('scan')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR)
    @(0, swagger_1.ApiOperation)({ summary: 'Scan QR code at gate' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: dto_1.QrValidationResultDto })
    async scan(
    @(0, common_1.Body)()
    scanQrCodeDto) {
        return this.qrCodesService.scan(scanQrCodeDto.token);
    }
    @(0, common_1.Get)(':id/validate')
    @(0, swagger_1.ApiOperation)({ summary: 'Pre-scan validation of QR code' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: dto_1.QrValidationResultDto })
    async validate(
    @(0, common_1.Param)('id')
    id) {
        return this.qrCodesService.validate(id);
    }
    @(0, common_1.Get)('booking/:bookingId')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER, enums_1.UserRole.DRIVER)
    @(0, swagger_1.ApiOperation)({ summary: 'Get or generate QR code for booking' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: dto_1.QrCodeResponseDto })
    async getForBooking(
    @(0, common_1.Param)('bookingId')
    bookingId, 
    @(0, decorators_1.CurrentUser)('id')
    userId, 
    @(0, decorators_1.CurrentUser)('role')
    role) {
        return this.qrCodesService.getForBooking(bookingId, userId, role);
    }
    @(0, common_1.Post)(':id/use')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR)
    @(0, swagger_1.ApiOperation)({ summary: 'Mark QR code as used' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: dto_1.QrCodeResponseDto })
    async markUsed(
    @(0, common_1.Param)('id')
    id) {
        return this.qrCodesService.markUsed(id);
    }
    @(0, common_1.Post)('booking/:bookingId/generate')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Generate QR code for a confirmed booking' })
    @(0, swagger_1.ApiResponse)({ status: 201, type: dto_1.QrCodeResponseDto })
    async generateForBooking(
    @(0, common_1.Param)('bookingId')
    bookingId) {
        return this.qrCodesService.generateForBooking(bookingId);
    }
}
exports.QrCodesController = QrCodesController;
