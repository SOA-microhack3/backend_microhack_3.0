import { PortsService } from './ports.service';
import { CreatePortDto, UpdatePortDto, PortResponseDto } from './dto';
export declare class PortsController {
    private readonly portsService;
    constructor(portsService: PortsService);
    findAll(): Promise<PortResponseDto[]>;
    findOne(id: string): Promise<PortResponseDto>;
    getTerminals(id: string): Promise<any[]>;
    create(createPortDto: CreatePortDto): Promise<PortResponseDto>;
    update(id: string, updatePortDto: UpdatePortDto): Promise<PortResponseDto>;
    remove(id: string): Promise<{
        message: string;
    }>;
}
