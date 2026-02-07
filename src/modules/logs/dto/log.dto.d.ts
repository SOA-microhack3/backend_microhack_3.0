import { ActorType, EntityType, LogAction } from '../../../common/enums';
export declare class CreateLogDto {
    organizationId?: string;
    actorType: ActorType;
    actorId?: string;
    entityType: EntityType;
    entityId: string;
    action: LogAction;
    description: string;
}
export declare class LogResponseDto {
    id: string;
    organizationId?: string;
    actorType: ActorType;
    actorId?: string;
    entityType: EntityType;
    entityId: string;
    action: LogAction;
    description: string;
    createdAt: Date;
}
export declare class LogFilterDto {
    entityType?: EntityType;
    action?: LogAction;
    actorId?: string;
}
