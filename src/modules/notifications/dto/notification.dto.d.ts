import { NotificationType, NotificationSource } from '../../../common/enums';
export declare class CreateNotificationDto {
    userId: string;
    type: NotificationType;
    source: NotificationSource;
    message: string;
}
export declare class MarkReadDto {
    notificationIds: string[];
}
export declare class NotificationResponseDto {
    id: string;
    userId: string;
    type: NotificationType;
    source: NotificationSource;
    message: string;
    readAt?: Date;
    createdAt: Date;
}
