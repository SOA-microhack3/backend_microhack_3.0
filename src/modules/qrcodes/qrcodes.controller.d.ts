import { QrCodesService } from './qrcodes.service';
import { ScanQrCodeDto, QrCodeResponseDto, QrValidationResultDto } from './dto';
import { UserRole } from '../../common/enums';
export declare class QrCodesController {
    private readonly qrCodesService;
    constructor(qrCodesService: QrCodesService);
    scan(scanQrCodeDto: ScanQrCodeDto): Promise<QrValidationResultDto>;
    validate(id: string): Promise<QrValidationResultDto>;
    getForBooking(bookingId: string, userId: string, role: UserRole): Promise<QrCodeResponseDto>;
    markUsed(id: string): Promise<QrCodeResponseDto>;
    generateForBooking(bookingId: string): Promise<QrCodeResponseDto>;
}
