import { TerminalsService } from './terminals.service';
import { CreateTerminalDto, UpdateTerminalDto, TerminalResponseDto, TerminalCapacityDto } from './dto';
export declare class TerminalsController {
    private readonly terminalsService;
    constructor(terminalsService: TerminalsService);
    findAll(portId?: string): Promise<TerminalResponseDto[]>;
    findOne(id: string): Promise<TerminalResponseDto>;
    getCapacity(id: string, dateStr?: string): Promise<TerminalCapacityDto>;
    getTodayBookings(id: string): Promise<any[]>;
    create(createTerminalDto: CreateTerminalDto): Promise<TerminalResponseDto>;
    update(id: string, updateTerminalDto: UpdateTerminalDto): Promise<TerminalResponseDto>;
}
