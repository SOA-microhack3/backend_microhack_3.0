import { ActorType, EntityType, LogAction } from '../../../common/enums';
export declare class Log {
    id: string;
    organizationId: string;
    actorType: ActorType;
    actorId: string;
    entityType: EntityType;
    entityId: string;
    action: LogAction;
    description: string;
    createdAt: Date;
}
