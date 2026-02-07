import { NotificationType, NotificationSource } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';
export declare class Notification {
    id: string;
    userId: string;
    user: User;
    type: NotificationType;
    source: NotificationSource;
    message: string;
    readAt: Date;
    createdAt: Date;
}
