import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('qrcodes')
export class QrCode {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'booking_id' })
    bookingId: string;

    @ManyToOne(() => Booking, (booking) => booking.qrCodes)
    @JoinColumn({ name: 'booking_id' })
    booking: Booking;

    @Column({ name: 'jwt_token', unique: true })
    jwtToken: string;

    @Column({ name: 'qr_code_data', type: 'text' })
    qrCodeData: string; // Base64 encoded QR image

    @Column({ name: 'expires_at', type: 'timestamp' })
    expiresAt: Date;

    @Column({ name: 'used_at', type: 'timestamp', nullable: true })
    usedAt: Date;

    @Column({ name: 'path_id', nullable: true })
    pathId: string; // Gate path identifier

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
