import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { QrCodesService } from './qrcodes.service';
import { ScanQrCodeDto, QrCodeResponseDto, QrValidationResultDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole } from '../../common/enums';

@ApiTags('QR Codes')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('qrcodes')
export class QrCodesController {
    constructor(private readonly qrCodesService: QrCodesService) { }

    @Post('scan')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Scan QR code at gate' })
    @ApiResponse({ status: 200, type: QrValidationResultDto })
    async scan(@Body() scanQrCodeDto: ScanQrCodeDto): Promise<QrValidationResultDto> {
        return this.qrCodesService.scan(scanQrCodeDto.token);
    }

    @Get(':id/validate')
    @ApiOperation({ summary: 'Pre-scan validation of QR code' })
    @ApiResponse({ status: 200, type: QrValidationResultDto })
    async validate(@Param('id') id: string): Promise<QrValidationResultDto> {
        return this.qrCodesService.validate(id);
    }

    @Get('booking/:bookingId')
    @Roles(UserRole.ADMIN, UserRole.CARRIER, UserRole.DRIVER)
    @ApiOperation({ summary: 'Get or generate QR code for booking' })
    @ApiResponse({ status: 200, type: QrCodeResponseDto })
    async getForBooking(
        @Param('bookingId') bookingId: string,
        @CurrentUser('id') userId: string,
        @CurrentUser('role') role: UserRole,
    ): Promise<QrCodeResponseDto> {
        return this.qrCodesService.getForBooking(bookingId, userId, role);
    }

    @Post(':id/use')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Mark QR code as used' })
    @ApiResponse({ status: 200, type: QrCodeResponseDto })
    async markUsed(@Param('id') id: string): Promise<QrCodeResponseDto> {
        return this.qrCodesService.markUsed(id);
    }

    @Post('booking/:bookingId/generate')
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Generate QR code for a confirmed booking' })
    @ApiResponse({ status: 201, type: QrCodeResponseDto })
    async generateForBooking(
        @Param('bookingId') bookingId: string,
    ): Promise<QrCodeResponseDto> {
        return this.qrCodesService.generateForBooking(bookingId);
    }
}
