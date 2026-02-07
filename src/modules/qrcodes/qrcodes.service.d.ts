import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { QrCode } from './entities/qrcode.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingsService } from '../bookings/bookings.service';
import { QrCodeResponseDto, QrValidationResultDto } from './dto';
import { UserRole } from '../../common/enums';
export declare class QrCodesService {
    private qrCodesRepository;
    private bookingsRepository;
    private bookingsService;
    private jwtService;
    private configService;
    constructor(qrCodesRepository: Repository<QrCode>, bookingsRepository: Repository<Booking>, bookingsService: BookingsService, jwtService: JwtService, configService: ConfigService);
    generateForBooking(bookingId: string): Promise<QrCodeResponseDto>;
    validate(id: string): Promise<QrValidationResultDto>;
    scan(token: string): Promise<QrValidationResultDto>;
    markUsed(id: string): Promise<QrCodeResponseDto>;
    getForBooking(bookingId: string, userId: string, role: UserRole): Promise<QrCodeResponseDto>;
    private validateQrCode;
    private toResponseDto;
}
