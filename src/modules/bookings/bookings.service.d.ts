import { Repository, DataSource } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Terminal } from '../terminals/entities/terminal.entity';
import { Truck } from '../trucks/entities/truck.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { Carrier } from '../carriers/entities/carrier.entity';
import { Operator } from '../operators/entities/operator.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { CreateBookingDto, UpdateBookingDto, BookingResponseDto, BookingWithDetailsDto } from './dto';
import { BookingStatus, UserRole } from '../../common/enums';
export declare class BookingsService {
    private bookingsRepository;
    private terminalsRepository;
    private trucksRepository;
    private driversRepository;
    private carriersRepository;
    private operatorsRepository;
    private notificationsService;
    private dataSource;
    constructor(bookingsRepository: Repository<Booking>, terminalsRepository: Repository<Terminal>, trucksRepository: Repository<Truck>, driversRepository: Repository<Driver>, carriersRepository: Repository<Carrier>, operatorsRepository: Repository<Operator>, notificationsService: NotificationsService, dataSource: DataSource);
    findAll(userId: string, userRole: UserRole, carrierId?: string, terminalId?: string, status?: BookingStatus): Promise<BookingWithDetailsDto[]>;
    findOne(id: string): Promise<BookingWithDetailsDto>;
    findByReference(reference: string): Promise<BookingWithDetailsDto>;
    create(createBookingDto: CreateBookingDto, carrierId: string | undefined, userId: string): Promise<BookingResponseDto>;
    update(id: string, updateBookingDto: UpdateBookingDto, carrierId: string | undefined, userId: string): Promise<BookingResponseDto>;
    cancel(id: string, userId: string, userRole: UserRole): Promise<BookingResponseDto>;
    confirm(id: string): Promise<BookingResponseDto>;
    reject(id: string): Promise<BookingResponseDto>;
    markConsumed(id: string): Promise<BookingResponseDto>;
    getAvailability(terminalId: string, date: Date): Promise<{
        slots: any[];
        maxCapacity: number;
    }>;
    private generateBookingReference;
    private toResponseDto;
    private toDetailedResponseDto;
}
