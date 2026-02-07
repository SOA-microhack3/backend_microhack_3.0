import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Log } from './entities/log.entity';
import { CreateLogDto, LogResponseDto, LogFilterDto } from './dto';
import { EntityType } from '../../common/enums';

@Injectable()
export class LogsService {
    constructor(
        @InjectRepository(Log)
        private logsRepository: Repository<Log>,
    ) { }

    async findAll(filters: LogFilterDto): Promise<LogResponseDto[]> {
        const queryBuilder = this.logsRepository.createQueryBuilder('log');

        if (filters.entityType) {
            queryBuilder.andWhere('log.entityType = :entityType', {
                entityType: filters.entityType,
            });
        }

        if (filters.action) {
            queryBuilder.andWhere('log.action = :action', { action: filters.action });
        }

        if (filters.actorId) {
            queryBuilder.andWhere('log.actorId = :actorId', {
                actorId: filters.actorId,
            });
        }

        queryBuilder.orderBy('log.createdAt', 'DESC').take(100);

        const logs = await queryBuilder.getMany();
        return logs.map(this.toResponseDto);
    }

    async findByEntity(entityType: EntityType, entityId: string): Promise<LogResponseDto[]> {
        const logs = await this.logsRepository.find({
            where: { entityType, entityId },
            order: { createdAt: 'DESC' },
        });
        return logs.map(this.toResponseDto);
    }

    async create(createLogDto: CreateLogDto): Promise<LogResponseDto> {
        const log = this.logsRepository.create(createLogDto);
        await this.logsRepository.save(log);
        return this.toResponseDto(log);
    }

    private toResponseDto(log: Log): LogResponseDto {
        return {
            id: log.id,
            organizationId: log.organizationId,
            actorType: log.actorType,
            actorId: log.actorId,
            entityType: log.entityType,
            entityId: log.entityId,
            action: log.action,
            description: log.description,
            createdAt: log.createdAt,
        };
    }
}
