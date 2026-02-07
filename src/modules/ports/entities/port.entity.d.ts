import { Terminal } from '../../terminals/entities/terminal.entity';
import { Operator } from '../../operators/entities/operator.entity';
import { Booking } from '../../bookings/entities/booking.entity';
export declare class Port {
    id: string;
    name: string;
    countryCode: string;
    timezone: string;
    slotDuration: number;
    createdAt: Date;
    terminals: Terminal[];
    operators: Operator[];
    bookings: Booking[];
}
