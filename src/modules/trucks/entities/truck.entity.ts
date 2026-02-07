import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { TruckStatus } from '../../../common/enums';
import { Carrier } from '../../carriers/entities/carrier.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('trucks')
export class Truck {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'plate_number', unique: true })
    plateNumber: string;

    @Column({ name: 'carrier_id' })
    carrierId: string;

    @ManyToOne(() => Carrier, (carrier) => carrier.trucks)
    @JoinColumn({ name: 'carrier_id' })
    carrier: Carrier;

    @Column({
        type: 'enum',
        enum: TruckStatus,
        default: TruckStatus.ACTIVE,
    })
    status: TruckStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => Booking, (booking) => booking.truck)
    bookings: Booking[];
}
