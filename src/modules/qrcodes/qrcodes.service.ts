import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { QrCode } from './entities/qrcode.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingsService } from '../bookings/bookings.service';
import { QrCodeResponseDto, QrValidationResultDto } from './dto';
import { BookingStatus, UserRole } from '../../common/enums';

interface QrPayload {
    bookingId: string;
    truckId: string;
    driverId: string;
    terminalId: string;
    slotStart: string;
    slotEnd: string;
    type: 'gate_access';
}

@Injectable()
export class QrCodesService {
    constructor(
        @InjectRepository(QrCode)
        private qrCodesRepository: Repository<QrCode>,
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        private bookingsService: BookingsService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async generateForBooking(bookingId: string): Promise<QrCodeResponseDto> {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId },
            relations: ['truck', 'driver', 'terminal'],
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.status !== BookingStatus.CONFIRMED) {
            throw new BadRequestException('QR code can only be generated for confirmed bookings');
        }

        // Check if QR already exists
        const existingQr = await this.qrCodesRepository.findOne({
            where: { bookingId },
        });
        if (existingQr && existingQr.expiresAt > new Date()) {
            return this.toResponseDto(existingQr);
        }

        // Generate JWT payload
        const payload: QrPayload = {
            bookingId: booking.id,
            truckId: booking.truckId,
            driverId: booking.driverId,
            terminalId: booking.terminalId,
            slotStart: booking.slotStart.toISOString(),
            slotEnd: booking.slotEnd.toISOString(),
            type: 'gate_access',
        };

        // Set expiration to slot end time + 1 hour buffer
        const expiresAt = new Date(booking.slotEnd);
        expiresAt.setHours(expiresAt.getHours() + 1);

        const jwtToken = this.jwtService.sign(payload, {
            expiresIn: Math.floor((expiresAt.getTime() - Date.now()) / 1000),
        });

        // Generate QR code data (base64 encoded JSON with token)
        const qrData = Buffer.from(
            JSON.stringify({
                token: jwtToken,
                bookingRef: booking.bookingReference,
            }),
        ).toString('base64');

        const qrCode = this.qrCodesRepository.create({
            bookingId,
            jwtToken,
            qrCodeData: qrData,
            expiresAt,
        });

        await this.qrCodesRepository.save(qrCode);
        return this.toResponseDto(qrCode);
    }

    async validate(id: string): Promise<QrValidationResultDto> {
        const qrCode = await this.qrCodesRepository.findOne({
            where: { id },
            relations: ['booking', 'booking.truck', 'booking.driver', 'booking.driver.user', 'booking.terminal'],
        });

        if (!qrCode) {
            return { valid: false, message: 'QR code not found' };
        }

        return this.validateQrCode(qrCode);
    }

    async scan(token: string): Promise<QrValidationResultDto> {
        const normalizeToken = (value: string): string => {
            let raw = (value || '').trim();
            if (!raw) return raw;

            if (/^Bearer\s+/i.test(raw)) {
                raw = raw.replace(/^Bearer\s+/i, '').trim();
            }

            if (raw.startsWith('token=')) {
                raw = raw.slice('token='.length).trim();
            }

            if (raw.startsWith('{') && raw.endsWith('}')) {
                try {
                    const parsed = JSON.parse(raw);
                    if (parsed?.token) {
                        raw = String(parsed.token);
                    }
                } catch {
                    // ignore
                }
            }

            const looksBase64 =
                /^[A-Za-z0-9+/=]+$/.test(raw) && raw.length >= 16 && raw.length % 4 === 0;
            if (looksBase64) {
                try {
                    const decoded = Buffer.from(raw, 'base64').toString('utf8');
                    const parsed = JSON.parse(decoded);
                    if (parsed?.token) {
                        raw = String(parsed.token);
                    }
                } catch {
                    // ignore
                }
            }

            return raw;
        };

        const normalizedToken = normalizeToken(token);
        if (!normalizedToken) {
            return { valid: false, message: 'QR code is empty' };
        }

        // Verify JWT token
        let payload: QrPayload;
        try {
            payload = this.jwtService.verify<QrPayload>(normalizedToken);
        } catch {
            return { valid: false, message: 'Invalid or expired QR code' };
        }

        let qrCode = await this.qrCodesRepository.findOne({
            where: { jwtToken: normalizedToken },
            relations: ['booking', 'booking.truck', 'booking.driver', 'booking.driver.user', 'booking.terminal'],
        });

        if (!qrCode) {
            qrCode = await this.qrCodesRepository.findOne({
                where: { bookingId: payload.bookingId },
                order: { createdAt: 'DESC' },
                relations: ['booking', 'booking.truck', 'booking.driver', 'booking.driver.user', 'booking.terminal'],
            });
        }

        if (!qrCode) {
            return { valid: false, message: 'QR code not found in system' };
        }

        const validationResult = await this.validateQrCode(qrCode);

        if (validationResult.valid) {
            // Mark as used and update booking status
            qrCode.usedAt = new Date();
            await this.qrCodesRepository.save(qrCode);
            await this.bookingsService.markConsumed(qrCode.bookingId);

            return {
                ...validationResult,
                message: 'Access granted. Gate opening.',
            };
        }

        return validationResult;
    }

    async markUsed(id: string): Promise<QrCodeResponseDto> {
        const qrCode = await this.qrCodesRepository.findOne({ where: { id } });
        if (!qrCode) {
            throw new NotFoundException('QR code not found');
        }

        if (qrCode.usedAt) {
            throw new BadRequestException('QR code has already been used');
        }

        qrCode.usedAt = new Date();
        await this.qrCodesRepository.save(qrCode);

        // Mark booking as consumed
        await this.bookingsService.markConsumed(qrCode.bookingId);

        return this.toResponseDto(qrCode);
    }

    async getForBooking(bookingId: string, userId: string, role: UserRole): Promise<QrCodeResponseDto> {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId },
            relations: ['driver', 'driver.user', 'carrier'],
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (role === UserRole.DRIVER) {
            if (booking.driver?.userId !== userId) {
                throw new ForbiddenException('Access denied');
            }
        }

        if (role === UserRole.CARRIER) {
            if (booking.carrier?.userId !== userId) {
                throw new ForbiddenException('Access denied');
            }
        }

        const existingQr = await this.qrCodesRepository.findOne({
            where: { bookingId },
        });

        if (existingQr) {
            return this.toResponseDto(existingQr);
        }

        return this.generateForBooking(bookingId);
    }

    private async validateQrCode(qrCode: QrCode): Promise<QrValidationResultDto> {
        const booking = qrCode.booking;

        // Check if already used
        if (qrCode.usedAt) {
            return { valid: false, message: 'QR code has already been used' };
        }

        // Check expiration
        if (qrCode.expiresAt < new Date()) {
            return { valid: false, message: 'QR code has expired' };
        }

        // Check booking status
        if (booking.status !== BookingStatus.CONFIRMED) {
            return {
                valid: false,
                message: `Booking is ${booking.status.toLowerCase()}, not confirmed`,
            };
        }

        // Check if within time window (allow 30 min before slot start)
        const now = new Date();
        const earlyWindow = new Date(booking.slotStart);
        earlyWindow.setMinutes(earlyWindow.getMinutes() - 30);

        if (now < earlyWindow) {
            return {
                valid: false,
                message: `Too early. Access allowed from ${earlyWindow.toLocaleTimeString()}`,
            };
        }

        if (now > booking.slotEnd) {
            return { valid: false, message: 'Slot time has passed' };
        }

        return {
            valid: true,
            message: 'Valid QR code',
            booking: {
                id: booking.id,
                bookingReference: booking.bookingReference,
                truckPlate: booking.truck?.plateNumber || 'Unknown',
                driverName: booking.driver?.user?.fullName || 'Unknown',
                slotStart: booking.slotStart,
                slotEnd: booking.slotEnd,
                terminalName: booking.terminal?.name || 'Unknown',
            },
        };
    }

    private toResponseDto(qrCode: QrCode): QrCodeResponseDto {
        return {
            id: qrCode.id,
            bookingId: qrCode.bookingId,
            jwtToken: qrCode.jwtToken,
            qrCodeData: qrCode.qrCodeData,
            expiresAt: qrCode.expiresAt,
            usedAt: qrCode.usedAt,
            pathId: qrCode.pathId,
            createdAt: qrCode.createdAt,
        };
    }
}
