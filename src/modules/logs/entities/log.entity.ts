import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
} from 'typeorm';
import {
    ActorType,
    EntityType,
    LogAction,
} from '../../../common/enums';

@Entity('logs')
export class Log {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'organization_id', nullable: true })
    organizationId: string;

    @Column({
        name: 'actor_type',
        type: 'enum',
        enum: ActorType,
    })
    actorType: ActorType;

    @Column({ name: 'actor_id', nullable: true })
    actorId: string;

    @Column({
        name: 'entity_type',
        type: 'enum',
        enum: EntityType,
    })
    entityType: EntityType;

    @Column({ name: 'entity_id' })
    entityId: string;

    @Column({
        type: 'enum',
        enum: LogAction,
    })
    action: LogAction;

    @Column({ type: 'text' })
    description: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
