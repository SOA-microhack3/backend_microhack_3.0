import { Repository } from 'typeorm';
import { Truck } from './entities/truck.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { CreateTruckDto, UpdateTruckDto, UpdateTruckStatusDto, TruckResponseDto } from './dto';
export declare class TrucksService {
    private trucksRepository;
    private bookingsRepository;
    constructor(trucksRepository: Repository<Truck>, bookingsRepository: Repository<Booking>);
    findAll(carrierId?: string): Promise<TruckResponseDto[]>;
    findOne(id: string): Promise<TruckResponseDto>;
    findOneEntity(id: string): Promise<Truck>;
    create(createTruckDto: CreateTruckDto): Promise<TruckResponseDto>;
    update(id: string, updateTruckDto: UpdateTruckDto): Promise<TruckResponseDto>;
    updateStatus(id: string, updateTruckStatusDto: UpdateTruckStatusDto): Promise<TruckResponseDto>;
    getAvailability(id: string, date: Date): Promise<any>;
    private toResponseDto;
}
