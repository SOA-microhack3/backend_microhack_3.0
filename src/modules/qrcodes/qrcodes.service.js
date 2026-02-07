"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCodesService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../../common/enums");
@(0, common_1.Injectable)()
class QrCodesService {
    qrCodesRepository;
    bookingsRepository;
    bookingsService;
    jwtService;
    configService;
    constructor(
    @(0, typeorm_1.InjectRepository)(qrcode_entity_1.QrCode)
    qrCodesRepository, 
    @(0, typeorm_1.InjectRepository)(booking_entity_1.Booking)
    bookingsRepository, bookingsService, jwtService, configService) {
        this.qrCodesRepository = qrCodesRepository;
        this.bookingsRepository = bookingsRepository;
        this.bookingsService = bookingsService;
        this.jwtService = jwtService;
        this.configService = configService;
    }
    async generateForBooking(bookingId) {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId },
            relations: ['truck', 'driver', 'terminal'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== enums_1.BookingStatus.CONFIRMED) {
            throw new common_1.BadRequestException('QR code can only be generated for confirmed bookings');
        }
        const existingQr = await this.qrCodesRepository.findOne({
            where: { bookingId },
        });
        if (existingQr && existingQr.expiresAt > new Date()) {
            return this.toResponseDto(existingQr);
        }
        const payload = {
            bookingId: booking.id,
            truckId: booking.truckId,
            driverId: booking.driverId,
            terminalId: booking.terminalId,
            slotStart: booking.slotStart.toISOString(),
            slotEnd: booking.slotEnd.toISOString(),
            type: 'gate_access',
        };
        const expiresAt = new Date(booking.slotEnd);
        expiresAt.setHours(expiresAt.getHours() + 1);
        const jwtToken = this.jwtService.sign(payload, {
            expiresIn: Math.floor((expiresAt.getTime() - Date.now()) / 1000),
        });
        const qrData = Buffer.from(JSON.stringify({
            token: jwtToken,
            bookingRef: booking.bookingReference,
        })).toString('base64');
        const qrCode = this.qrCodesRepository.create({
            bookingId,
            jwtToken,
            qrCodeData: qrData,
            expiresAt,
        });
        await this.qrCodesRepository.save(qrCode);
        return this.toResponseDto(qrCode);
    }
    async validate(id) {
        const qrCode = await this.qrCodesRepository.findOne({
            where: { id },
            relations: ['booking', 'booking.truck', 'booking.driver', 'booking.driver.user', 'booking.terminal'],
        });
        if (!qrCode) {
            return { valid: false, message: 'QR code not found' };
        }
        return this.validateQrCode(qrCode);
    }
    async scan(token) {
        const normalizeToken = (value) => {
            let raw = (value || '').trim();
            if (!raw)
                return raw;
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
                }
                catch {
                }
            }
            const looksBase64 = /^[A-Za-z0-9+/=]+$/.test(raw) && raw.length >= 16 && raw.length % 4 === 0;
            if (looksBase64) {
                try {
                    const decoded = Buffer.from(raw, 'base64').toString('utf8');
                    const parsed = JSON.parse(decoded);
                    if (parsed?.token) {
                        raw = String(parsed.token);
                    }
                }
                catch {
                }
            }
            return raw;
        };
        const normalizedToken = normalizeToken(token);
        if (!normalizedToken) {
            return { valid: false, message: 'QR code is empty' };
        }
        let payload;
        try {
            payload = this.jwtService.verify(normalizedToken);
        }
        catch {
            return { valid: false, message: 'Invalid or expired QR code' };
        }
        const qrCode = await this.qrCodesRepository.findOne({
            where: { jwtToken: normalizedToken },
            relations: ['booking', 'booking.truck', 'booking.driver', 'booking.driver.user', 'booking.terminal'],
        });
        if (!qrCode) {
            return { valid: false, message: 'QR code not found in system' };
        }
        const validationResult = await this.validateQrCode(qrCode);
        if (validationResult.valid) {
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
    async markUsed(id) {
        const qrCode = await this.qrCodesRepository.findOne({ where: { id } });
        if (!qrCode) {
            throw new common_1.NotFoundException('QR code not found');
        }
        if (qrCode.usedAt) {
            throw new common_1.BadRequestException('QR code has already been used');
        }
        qrCode.usedAt = new Date();
        await this.qrCodesRepository.save(qrCode);
        await this.bookingsService.markConsumed(qrCode.bookingId);
        return this.toResponseDto(qrCode);
    }
    async getForBooking(bookingId, userId, role) {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId },
            relations: ['driver', 'driver.user', 'carrier'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (role === enums_1.UserRole.DRIVER) {
            if (booking.driver?.userId !== userId) {
                throw new common_1.ForbiddenException('Access denied');
            }
        }
        if (role === enums_1.UserRole.CARRIER) {
            if (booking.carrier?.userId !== userId) {
                throw new common_1.ForbiddenException('Access denied');
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
    async validateQrCode(qrCode) {
        const booking = qrCode.booking;
        if (qrCode.usedAt) {
            return { valid: false, message: 'QR code has already been used' };
        }
        if (qrCode.expiresAt < new Date()) {
            return { valid: false, message: 'QR code has expired' };
        }
        if (booking.status !== enums_1.BookingStatus.CONFIRMED) {
            return {
                valid: false,
                message: `Booking is ${booking.status.toLowerCase()}, not confirmed`,
            };
        }
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
    toResponseDto(qrCode) {
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
exports.QrCodesService = QrCodesService;
