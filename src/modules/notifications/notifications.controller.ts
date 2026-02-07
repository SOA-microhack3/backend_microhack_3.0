import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { NotificationsService } from './notifications.service';
import { MarkReadDto, NotificationResponseDto } from './dto';
import { JwtAuthGuard } from '../../common/guards';

@ApiTags('Notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationsController {
    constructor(private readonly notificationsService: NotificationsService) { }

    @Get()
    @ApiOperation({ summary: 'Get user notifications' })
    @ApiResponse({ status: 200, type: [NotificationResponseDto] })
    async findAll(@Req() req: any): Promise<NotificationResponseDto[]> {
        return this.notificationsService.findAll(req.user.id);
    }

    @Get('unread-count')
    @ApiOperation({ summary: 'Get unread notification count' })
    @ApiResponse({ status: 200 })
    async getUnreadCount(@Req() req: any): Promise<{ count: number }> {
        const count = await this.notificationsService.getUnreadCount(req.user.id);
        return { count };
    }

    @Post('mark-read')
    @ApiOperation({ summary: 'Mark notifications as read' })
    @ApiResponse({ status: 200 })
    async markRead(@Body() markReadDto: MarkReadDto): Promise<{ message: string }> {
        await this.notificationsService.markRead(markReadDto.notificationIds);
        return { message: 'Notifications marked as read' };
    }

    @Post('mark-all-read')
    @ApiOperation({ summary: 'Mark all notifications as read' })
    @ApiResponse({ status: 200 })
    async markAllRead(@Req() req: any): Promise<{ message: string }> {
        await this.notificationsService.markAllRead(req.user.id);
        return { message: 'All notifications marked as read' };
    }
}
