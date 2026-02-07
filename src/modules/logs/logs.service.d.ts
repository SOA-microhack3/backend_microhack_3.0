import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { CreateLogDto, LogResponseDto, LogFilterDto } from './dto';
import { EntityType } from '../../common/enums';
export declare class LogsService {
    private logsRepository;
    constructor(logsRepository: Repository<Log>);
    findAll(filters: LogFilterDto): Promise<LogResponseDto[]>;
    findByEntity(entityType: EntityType, entityId: string): Promise<LogResponseDto[]>;
    create(createLogDto: CreateLogDto): Promise<LogResponseDto>;
    private toResponseDto;
}
