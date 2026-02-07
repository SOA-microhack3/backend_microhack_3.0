import { Repository } from 'typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { Terminal } from '../terminals/entities/terminal.entity';
import { Carrier } from '../carriers/entities/carrier.entity';
export declare class AiService {
    private bookingsRepository;
    private terminalsRepository;
    private carriersRepository;
    constructor(bookingsRepository: Repository<Booking>, terminalsRepository: Repository<Terminal>, carriersRepository: Repository<Carrier>);
    getAvailability(terminalName: string, date: string, timeRange?: string): Promise<any>;
    getBookingStatus(reference: string): Promise<any>;
    getCarrierHistory(carrierId: string, days?: number): Promise<any>;
    getBookingSuggestions(carrierId: string, truckCount: number, preferredTerminal: string, preferredDate: string): Promise<any>;
}
