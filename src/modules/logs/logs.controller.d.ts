import { LogsService } from './logs.service';
import { LogResponseDto, LogFilterDto } from './dto';
import { EntityType } from '../../common/enums';
export declare class LogsController {
    private readonly logsService;
    constructor(logsService: LogsService);
    findAll(filters: LogFilterDto): Promise<LogResponseDto[]>;
    findByEntity(type: EntityType, id: string): Promise<LogResponseDto[]>;
}
