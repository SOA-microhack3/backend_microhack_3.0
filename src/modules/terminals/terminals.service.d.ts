import { Repository } from 'typeorm';
import { Terminal } from './entities/terminal.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Port } from '../ports/entities/port.entity';
import { CreateTerminalDto, UpdateTerminalDto, TerminalResponseDto, TerminalCapacityDto } from './dto';
export declare class TerminalsService {
    private terminalsRepository;
    private bookingsRepository;
    private portsRepository;
    constructor(terminalsRepository: Repository<Terminal>, bookingsRepository: Repository<Booking>, portsRepository: Repository<Port>);
    findAll(portId?: string): Promise<TerminalResponseDto[]>;
    findOne(id: string): Promise<TerminalResponseDto>;
    findOneEntity(id: string): Promise<Terminal>;
    create(createTerminalDto: CreateTerminalDto): Promise<TerminalResponseDto>;
    update(id: string, updateTerminalDto: UpdateTerminalDto): Promise<TerminalResponseDto>;
    getCapacity(id: string, date: Date): Promise<TerminalCapacityDto>;
    getTodayBookings(id: string): Promise<Booking[]>;
    private toResponseDto;
}
