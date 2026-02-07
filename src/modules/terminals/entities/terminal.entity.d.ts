import { Port } from '../../ports/entities/port.entity';
import { Operator } from '../../operators/entities/operator.entity';
import { Booking } from '../../bookings/entities/booking.entity';
export declare class Terminal {
    id: string;
    name: string;
    portId: string;
    port: Port;
    maxCapacity: number;
    createdAt: Date;
    operators: Operator[];
    bookings: Booking[];
}