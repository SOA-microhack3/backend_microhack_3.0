import { DriversService } from './drivers.service';
import { CreateDriverDto, UpdateDriverStatusDto, DriverResponseDto } from './dto';
export declare class DriversController {
    private readonly driversService;
    constructor(driversService: DriversService);
    findAll(carrierId?: string): Promise<DriverResponseDto[]>;
    getMe(userId: string): Promise<DriverResponseDto>;
    findOne(id: string): Promise<DriverResponseDto>;
    create(createDriverDto: CreateDriverDto): Promise<DriverResponseDto>;
    updateStatus(id: string, updateDriverStatusDto: UpdateDriverStatusDto): Promise<DriverResponseDto>;
}
