import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { NotificationType, NotificationSource } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @ManyToOne(() => User, (user) => user.notifications)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({
        type: 'enum',
        enum: NotificationType,
    })
    type: NotificationType;

    @Column({
        type: 'enum',
        enum: NotificationSource,
    })
    source: NotificationSource;

    @Column({ type: 'text' })
    message: string;

    @Column({ name: 'read_at', type: 'timestamp', nullable: true })
    readAt: Date;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
