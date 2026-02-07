import { User } from '../../users/entities/user.entity';
import { Driver } from '../../drivers/entities/driver.entity';
import { Truck } from '../../trucks/entities/truck.entity';
import { Booking } from '../../bookings/entities/booking.entity';
export declare class Carrier {
    id: string;
    userId: string;
    user: User;
    name: string;
    createdAt: Date;
    drivers: Driver[];
    trucks: Truck[];
    bookings: Booking[];
}
