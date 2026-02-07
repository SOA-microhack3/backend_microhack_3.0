import { Booking } from '../../bookings/entities/booking.entity';
export declare class QrCode {
    id: string;
    bookingId: string;
    booking: Booking;
    jwtToken: string;
    qrCodeData: string;
    expiresAt: Date;
    usedAt: Date;
    pathId: string;
    createdAt: Date;
}
