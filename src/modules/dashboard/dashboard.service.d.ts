import { Repository } from 'typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { Truck } from '../trucks/entities/truck.entity';
import { Driver } from '../drivers/entities/driver.entity';
export declare class DashboardService {
    private bookingsRepository;
    private trucksRepository;
    private driversRepository;
    constructor(bookingsRepository: Repository<Booking>, trucksRepository: Repository<Truck>, driversRepository: Repository<Driver>);
    getOperatorOverview(terminalId: string): Promise<any>;
    getPendingApprovals(terminalId: string): Promise<any[]>;
    getTodayTraffic(terminalId: string): Promise<any[]>;
    getOperatorAlerts(terminalId: string): Promise<any[]>;
    getCarrierOverview(carrierId: string): Promise<any>;
    getUpcomingBookings(carrierId: string): Promise<any[]>;
    getFleetStatus(carrierId: string): Promise<any>;
}
