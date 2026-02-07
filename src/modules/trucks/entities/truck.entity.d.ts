import { TruckStatus } from '../../../common/enums';
import { Carrier } from '../../carriers/entities/carrier.entity';
import { Booking } from '../../bookings/entities/booking.entity';
export declare class Truck {
    id: string;
    plateNumber: string;
    carrierId: string;
    carrier: Carrier;
    status: TruckStatus;
    createdAt: Date;
    bookings: Booking[];
}
