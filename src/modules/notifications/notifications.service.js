"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
@(0, common_1.Injectable)()
class NotificationsService {
    notificationsRepository;
    constructor(
    @(0, typeorm_2.InjectRepository)(notification_entity_1.Notification)
    notificationsRepository) {
        this.notificationsRepository = notificationsRepository;
    }
    async findAll(userId) {
        const notifications = await this.notificationsRepository.find({
            where: { userId },
            order: { createdAt: 'DESC' },
            take: 50,
        });
        return notifications.map(this.toResponseDto);
    }
    async getUnreadCount(userId) {
        return this.notificationsRepository.count({
            where: { userId, readAt: (0, typeorm_1.IsNull)() },
        });
    }
    async create(createNotificationDto) {
        const notification = this.notificationsRepository.create(createNotificationDto);
        await this.notificationsRepository.save(notification);
        return this.toResponseDto(notification);
    }
    async markRead(notificationIds) {
        await this.notificationsRepository.update({ id: (0, typeorm_1.In)(notificationIds) }, { readAt: new Date() });
    }
    async markAllRead(userId) {
        await this.notificationsRepository.update({ userId, readAt: (0, typeorm_1.IsNull)() }, { readAt: new Date() });
    }
    toResponseDto(notification) {
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
exports.NotificationsService = NotificationsService;
