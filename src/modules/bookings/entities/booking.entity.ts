import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { BookingStatus } from '../../../common/enums';
import { Port } from '../../ports/entities/port.entity';
import { Terminal } from '../../terminals/entities/terminal.entity';
import { Carrier } from '../../carriers/entities/carrier.entity';
import { Truck } from '../../trucks/entities/truck.entity';
import { Driver } from '../../drivers/entities/driver.entity';
import { QrCode } from '../../qrcodes/entities/qrcode.entity';

@Entity('bookings')
export class Booking {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'port_id' })
    portId: string;

    @ManyToOne(() => Port, (port) => port.bookings)
    @JoinColumn({ name: 'port_id' })
    port: Port;

    @Column({ name: 'terminal_id' })
    terminalId: string;

    @ManyToOne(() => Terminal, (terminal) => terminal.bookings)
    @JoinColumn({ name: 'terminal_id' })
    terminal: Terminal;

    @Column({ name: 'carrier_id' })
    carrierId: string;

    @ManyToOne(() => Carrier, (carrier) => carrier.bookings)
    @JoinColumn({ name: 'carrier_id' })
    carrier: Carrier;

    @Column({ name: 'truck_id' })
    truckId: string;

    @ManyToOne(() => Truck, (truck) => truck.bookings)
    @JoinColumn({ name: 'truck_id' })
    truck: Truck;

    @Column({ name: 'driver_id' })
    driverId: string;

    @ManyToOne(() => Driver, (driver) => driver.bookings)
    @JoinColumn({ name: 'driver_id' })
    driver: Driver;

    @Column({
        type: 'enum',
        enum: BookingStatus,
        default: BookingStatus.PENDING,
    })
    status: BookingStatus;

    @Column({ name: 'slot_start', type: 'timestamp' })
    slotStart: Date;

    @Column({ name: 'slot_end', type: 'timestamp' })
    slotEnd: Date;

    @Column({ name: 'slots_count', default: 1 })
    slotsCount: number;

    @Column({ name: 'booking_reference', unique: true })
    bookingReference: string;

    @Column({ name: 'container_matricule', nullable: true })
    containerMatricule: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    @OneToMany(() => QrCode, (qrCode) => qrCode.booking)
    qrCodes: QrCode[];
}
