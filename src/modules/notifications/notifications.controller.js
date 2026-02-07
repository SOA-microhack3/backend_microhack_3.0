"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const guards_1 = require("../../common/guards");
@(0, swagger_1.ApiTags)('Notifications')
@(0, swagger_1.ApiBearerAuth)()
@(0, common_1.UseGuards)(guards_1.JwtAuthGuard)
@(0, common_1.Controller)('notifications')
class NotificationsController {
    notificationsService;
    constructor(notificationsService) {
        this.notificationsService = notificationsService;
    }
    @(0, common_1.Get)()
    @(0, swagger_1.ApiOperation)({ summary: 'Get user notifications' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: [dto_1.NotificationResponseDto] })
    async findAll(
    @(0, common_1.Req)()
    req) {
        return this.notificationsService.findAll(req.user.id);
    }
    @(0, common_1.Get)('unread-count')
    @(0, swagger_1.ApiOperation)({ summary: 'Get unread notification count' })
    @(0, swagger_1.ApiResponse)({ status: 200 })
    async getUnreadCount(
    @(0, common_1.Req)()
    req) {
        const count = await this.notificationsService.getUnreadCount(req.user.id);
        return { count };
    }
    @(0, common_1.Post)('mark-read')
    @(0, swagger_1.ApiOperation)({ summary: 'Mark notifications as read' })
    @(0, swagger_1.ApiResponse)({ status: 200 })
    async markRead(
    @(0, common_1.Body)()
    markReadDto) {
        await this.notificationsService.markRead(markReadDto.notificationIds);
        return { message: 'Notifications marked as read' };
    }
    @(0, common_1.Post)('mark-all-read')
    @(0, swagger_1.ApiOperation)({ summary: 'Mark all notifications as read' })
    @(0, swagger_1.ApiResponse)({ status: 200 })
    async markAllRead(
    @(0, common_1.Req)()
    req) {
        await this.notificationsService.markAllRead(req.user.id);
        return { message: 'All notifications marked as read' };
    }
}
exports.NotificationsController = NotificationsController;
