"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QrCode = void 0;
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
@(0, typeorm_1.Entity)('qrcodes')
class QrCode {
    @(0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    id;
    @(0, typeorm_1.Column)({ name: 'booking_id' })
    bookingId;
    @(0, typeorm_1.ManyToOne)(() => booking_entity_1.Booking, (booking) => booking.qrCodes)
    @(0, typeorm_1.JoinColumn)({ name: 'booking_id' })
    booking;
    @(0, typeorm_1.Column)({ name: 'jwt_token', unique: true })
    jwtToken;
    @(0, typeorm_1.Column)({ name: 'qr_code_data', type: 'text' })
    qrCodeData;
    @(0, typeorm_1.Column)({ name: 'expires_at', type: 'timestamp' })
    expiresAt;
    @(0, typeorm_1.Column)({ name: 'used_at', type: 'timestamp', nullable: true })
    usedAt;
    @(0, typeorm_1.Column)({ name: 'path_id', nullable: true })
    pathId;
    @(0, typeorm_1.CreateDateColumn)({ name: 'created_at' })
    createdAt;
}
exports.QrCode = QrCode;
