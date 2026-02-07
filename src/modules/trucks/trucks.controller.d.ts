import { TrucksService } from './trucks.service';
import { CreateTruckDto, UpdateTruckDto, UpdateTruckStatusDto, TruckResponseDto } from './dto';
export declare class TrucksController {
    private readonly trucksService;
    constructor(trucksService: TrucksService);
    findAll(carrierId?: string): Promise<TruckResponseDto[]>;
    findOne(id: string): Promise<TruckResponseDto>;
    getAvailability(id: string, dateStr?: string): Promise<any>;
    create(createTruckDto: CreateTruckDto): Promise<TruckResponseDto>;
    update(id: string, updateTruckDto: UpdateTruckDto): Promise<TruckResponseDto>;
    updateStatus(id: string, updateTruckStatusDto: UpdateTruckStatusDto): Promise<TruckResponseDto>;
}
