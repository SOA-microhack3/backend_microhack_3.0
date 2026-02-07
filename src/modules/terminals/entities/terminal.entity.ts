import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { Port } from '../../ports/entities/port.entity';
import { Operator } from '../../operators/entities/operator.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('terminals')
export class Terminal {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    name: string;

    @Column({ name: 'port_id' })
    portId: string;

    @ManyToOne(() => Port, (port) => port.terminals)
    @JoinColumn({ name: 'port_id' })
    port: Port;

    @Column({ name: 'max_capacity' })
    maxCapacity: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => Operator, (operator) => operator.terminal)
    operators: Operator[];

    @OneToMany(() => Booking, (booking) => booking.terminal)
    bookings: Booking[];
}
