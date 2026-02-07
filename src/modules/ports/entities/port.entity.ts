import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToMany,
} from 'typeorm';
import { Terminal } from '../../terminals/entities/terminal.entity';
import { Operator } from '../../operators/entities/operator.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('ports')
export class Port {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ name: 'country_code' })
    countryCode: string;

    @Column({ default: 'UTC' })
    timezone: string;

    @Column({ name: 'slot_duration', default: 60 })
    slotDuration: number; // in minutes

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => Terminal, (terminal) => terminal.port)
    terminals: Terminal[];

    @OneToMany(() => Operator, (operator) => operator.port)
    operators: Operator[];

    @OneToMany(() => Booking, (booking) => booking.port)
    bookings: Booking[];
}
