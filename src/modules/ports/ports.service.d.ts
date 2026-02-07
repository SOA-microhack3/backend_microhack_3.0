import { Repository } from 'typeorm';
import { Port } from './entities/port.entity';
import { CreatePortDto, UpdatePortDto, PortResponseDto } from './dto';
export declare class PortsService {
    private portsRepository;
    constructor(portsRepository: Repository<Port>);
    findAll(): Promise<PortResponseDto[]>;
    findOne(id: string): Promise<PortResponseDto>;
    findOneEntity(id: string): Promise<Port>;
    create(createPortDto: CreatePortDto): Promise<PortResponseDto>;
    update(id: string, updatePortDto: UpdatePortDto): Promise<PortResponseDto>;
    remove(id: string): Promise<void>;
    getTerminals(id: string): Promise<any[]>;
    private toResponseDto;
}
