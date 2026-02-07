import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto, UpdateDriverStatusDto, DriverResponseDto } from './dto';
export declare class DriversService {
    private driversRepository;
    constructor(driversRepository: Repository<Driver>);
    findAll(carrierId?: string): Promise<DriverResponseDto[]>;
    findOne(id: string): Promise<DriverResponseDto>;
    findOneEntity(id: string): Promise<Driver>;
    findByUserId(userId: string): Promise<Driver | null>;
    findByUserIdDto(userId: string): Promise<DriverResponseDto>;
    create(createDriverDto: CreateDriverDto): Promise<DriverResponseDto>;
    updateStatus(id: string, updateDriverStatusDto: UpdateDriverStatusDto): Promise<DriverResponseDto>;
    private toResponseDto;
}
