import { Repository } from 'typeorm';
import { Carrier } from './entities/carrier.entity';
import { CreateCarrierDto, UpdateCarrierDto, CarrierResponseDto } from './dto';
export declare class CarriersService {
    private carriersRepository;
    constructor(carriersRepository: Repository<Carrier>);
    findAll(): Promise<CarrierResponseDto[]>;
    findOne(id: string): Promise<CarrierResponseDto>;
    findByUserId(userId: string): Promise<Carrier | null>;
    findByUserIdDto(userId: string): Promise<CarrierResponseDto>;
    findOneEntity(id: string): Promise<Carrier>;
    create(createCarrierDto: CreateCarrierDto): Promise<CarrierResponseDto>;
    update(id: string, updateCarrierDto: UpdateCarrierDto): Promise<CarrierResponseDto>;
    getTrucks(id: string): Promise<any[]>;
    getDrivers(id: string): Promise<any[]>;
    private toResponseDto;
}
