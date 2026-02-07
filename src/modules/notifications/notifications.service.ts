import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In, IsNull } from 'typeorm';
import { Notification } from './entities/notification.entity';
import { CreateNotificationDto, NotificationResponseDto } from './dto';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationsRepository: Repository<Notification>,
    ) { }

    async findAll(userId: string): Promise<NotificationResponseDto[]> {
        const notifications = await this.notificationsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 50,
        });
        return notifications.map(this.toResponseDto);
    }

    async getUnreadCount(userId: string): Promise<number> {
        return this.notificationsRepository.count({
            where: { userId, readAt: IsNull() },
        });
    }

    async create(createNotificationDto: CreateNotificationDto): Promise<NotificationResponseDto> {
        const notification = this.notificationsRepository.create(createNotificationDto);
        await this.notificationsRepository.save(notification);
        return this.toResponseDto(notification);
    }

    async markRead(notificationIds: string[]): Promise<void> {
        await this.notificationsRepository.update(
            { id: In(notificationIds) },
            { readAt: new Date() },
        );
    }

    async markAllRead(userId: string): Promise<void> {
        await this.notificationsRepository.update(
            { userId, readAt: IsNull() },
            { readAt: new Date() },
        );
    }

    private toResponseDto(notification: Notification): NotificationResponseDto {
        return {
            id: notification.id,
            userId: notification.userId,
            type: notification.type,
            source: notification.source,
            message: notification.message,
            readAt: notification.readAt,
            createdAt: notification.createdAt,
        };
    }
}
