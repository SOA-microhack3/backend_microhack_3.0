import { CarriersService } from './carriers.service';
import { CreateCarrierDto, UpdateCarrierDto, CarrierResponseDto } from './dto';
export declare class CarriersController {
    private readonly carriersService;
    constructor(carriersService: CarriersService);
    findAll(): Promise<CarrierResponseDto[]>;
    getMe(userId: string): Promise<CarrierResponseDto>;
    findOne(id: string): Promise<CarrierResponseDto>;
    getTrucks(id: string): Promise<any[]>;
    getDrivers(id: string): Promise<any[]>;
    create(createCarrierDto: CreateCarrierDto): Promise<CarrierResponseDto>;
    update(id: string, updateCarrierDto: UpdateCarrierDto): Promise<CarrierResponseDto>;
}
