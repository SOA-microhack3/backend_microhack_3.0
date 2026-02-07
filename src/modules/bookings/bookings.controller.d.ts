import { BookingsService } from './bookings.service';
import { CreateBookingDto, UpdateBookingDto, BookingResponseDto, BookingWithDetailsDto } from './dto';
import { BookingStatus } from '../../common/enums';
export declare class BookingsController {
    private readonly bookingsService;
    constructor(bookingsService: BookingsService);
    findAll(req: any, status?: BookingStatus, carrierId?: string, terminalId?: string): Promise<BookingWithDetailsDto[]>;
    getAvailability(terminalId: string, dateStr?: string): Promise<any>;
    findOne(id: string): Promise<BookingWithDetailsDto>;
    create(createBookingDto: CreateBookingDto, req: any): Promise<BookingResponseDto>;
    update(id: string, updateBookingDto: UpdateBookingDto, req: any): Promise<BookingResponseDto>;
    cancel(id: string, req: any): Promise<BookingResponseDto>;
    confirm(id: string): Promise<BookingResponseDto>;
    reject(id: string): Promise<BookingResponseDto>;
}
