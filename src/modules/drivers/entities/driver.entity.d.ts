import { DriverStatus } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';
import { Carrier } from '../../carriers/entities/carrier.entity';
import { Booking } from '../../bookings/entities/booking.entity';
export declare class Driver {
    id: string;
    userId: string;
    user: User;
    carrierId: string;
    carrier: Carrier;
    status: DriverStatus;
    createdAt: Date;
    bookings: Booking[];
}
