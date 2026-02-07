import { IsEnum, IsOptional, IsString, IsUUID, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationType, NotificationSource } from '../../../common/enums';

export class CreateNotificationDto {
    @ApiProperty()
    @IsUUID()
    userId: string;

    @ApiProperty({ enum: NotificationType })
    @IsEnum(NotificationType)
    type: NotificationType;

    @ApiProperty({ enum: NotificationSource })
    @IsEnum(NotificationSource)
    source: NotificationSource;

    @ApiProperty()
    @IsString()
    message: string;
}

export class MarkReadDto {
    @ApiProperty({ type: [String] })
    @IsArray()
    @IsUUID('all', { each: true })
    notificationIds: string[];
}

export class NotificationResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty({ enum: NotificationType })
    type: NotificationType;

    @ApiProperty({ enum: NotificationSource })
    source: NotificationSource;

    @ApiProperty()
    message: string;

    @ApiPropertyOptional()
    readAt?: Date;

    @ApiProperty()
    createdAt: Date;
}
