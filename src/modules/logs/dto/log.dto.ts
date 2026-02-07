import { IsEnum, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ActorType, EntityType, LogAction } from '../../../common/enums';

export class CreateLogDto {
    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    organizationId?: string;

    @ApiProperty({ enum: ActorType })
    @IsEnum(ActorType)
    actorType: ActorType;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    actorId?: string;

    @ApiProperty({ enum: EntityType })
    @IsEnum(EntityType)
    entityType: EntityType;

    @ApiProperty()
    @IsUUID()
    entityId: string;

    @ApiProperty({ enum: LogAction })
    @IsEnum(LogAction)
    action: LogAction;

    @ApiProperty()
    @IsString()
    description: string;
}

export class LogResponseDto {
    @ApiProperty()
    id: string;

    @ApiPropertyOptional()
    organizationId?: string;

    @ApiProperty({ enum: ActorType })
    actorType: ActorType;

    @ApiPropertyOptional()
    actorId?: string;

    @ApiProperty({ enum: EntityType })
    entityType: EntityType;

    @ApiProperty()
    entityId: string;

    @ApiProperty({ enum: LogAction })
    action: LogAction;

    @ApiProperty()
    description: string;

    @ApiProperty()
    createdAt: Date;
}

export class LogFilterDto {
    @ApiPropertyOptional({ enum: EntityType })
    @IsEnum(EntityType)
    @IsOptional()
    entityType?: EntityType;

    @ApiPropertyOptional({ enum: LogAction })
    @IsEnum(LogAction)
    @IsOptional()
    action?: LogAction;

    @ApiPropertyOptional()
    @IsUUID()
    @IsOptional()
    actorId?: string;
}
