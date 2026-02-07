import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { DriverStatus } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';
import { Carrier } from '../../carriers/entities/carrier.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('drivers')
export class Driver {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @OneToOne(() => User, (user) => user.driver)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'carrier_id' })
    carrierId: string;

    @ManyToOne(() => Carrier, (carrier) => carrier.drivers)
    @JoinColumn({ name: 'carrier_id' })
    carrier: Carrier;

    @Column({
        type: 'enum',
        enum: DriverStatus,
        default: DriverStatus.ACTIVE,
    })
    status: DriverStatus;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => Booking, (booking) => booking.driver)
    bookings: Booking[];
}
