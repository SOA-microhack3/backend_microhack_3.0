import { Controller, Get, Query, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { LogsService } from './logs.service';
import { LogResponseDto, LogFilterDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';
import { UserRole, EntityType, LogAction } from '../../common/enums';

@ApiTags('Logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('logs')
export class LogsController {
    constructor(private readonly logsService: LogsService) { }

    @Get()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all logs (Admin only)' })
    @ApiQuery({ name: 'entityType', enum: EntityType, required: false })
    @ApiQuery({ name: 'action', enum: LogAction, required: false })
    @ApiQuery({ name: 'actorId', required: false })
    @ApiResponse({ status: 200, type: [LogResponseDto] })
    async findAll(@Query() filters: LogFilterDto): Promise<LogResponseDto[]> {
        return this.logsService.findAll(filters);
    }

    @Get('entity/:type/:id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get logs for specific entity' })
    @ApiResponse({ status: 200, type: [LogResponseDto] })
    async findByEntity(
        @Param('type') type: EntityType,
        @Param('id') id: string,
    ): Promise<LogResponseDto[]> {
        return this.logsService.findByEntity(type, id);
    }
}
