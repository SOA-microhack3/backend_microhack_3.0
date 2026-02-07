import { NotificationsService } from './notifications.service';
import { MarkReadDto, NotificationResponseDto } from './dto';
export declare class NotificationsController {
    private readonly notificationsService;
    constructor(notificationsService: NotificationsService);
    findAll(req: any): Promise<NotificationResponseDto[]>;
    getUnreadCount(req: any): Promise<{
        count: number;
    }>;
    markRead(markReadDto: MarkReadDto): Promise<{
        message: string;
    }>;
    markAllRead(req: any): Promise<{
        message: string;
    }>;
}
