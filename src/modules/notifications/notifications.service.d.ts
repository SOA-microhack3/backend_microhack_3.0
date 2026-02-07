import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto, NotificationResponseDto } from './dto';
export declare class NotificationsService {
    private notificationsRepository;
    constructor(notificationsRepository: Repository<Notification>);
    findAll(userId: string): Promise<NotificationResponseDto[]>;
    getUnreadCount(userId: string): Promise<number>;
    create(createNotificationDto: CreateNotificationDto): Promise<NotificationResponseDto>;
    markRead(notificationIds: string[]): Promise<void>;
    markAllRead(userId: string): Promise<void>;
    private toResponseDto;
}
