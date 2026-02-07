"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogsService = void 0;
const common_1 = require("@nestjs/common");
@(0, common_1.Injectable)()
class LogsService {
    logsRepository;
    constructor(
    @(0, typeorm_1.InjectRepository)(log_entity_1.Log)
    logsRepository) {
        this.logsRepository = logsRepository;
    }
    async findAll(filters) {
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
    async findByEntity(entityType, entityId) {
        const logs = await this.logsRepository.find({
            where: { entityType, entityId },
            order: { createdAt: 'DESC' },
        });
        return logs.map(this.toResponseDto);
    }
    async create(createLogDto) {
        const log = this.logsRepository.create(createLogDto);
        await this.logsRepository.save(log);
        return this.toResponseDto(log);
    }
    toResponseDto(log) {
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
exports.LogsService = LogsService;
