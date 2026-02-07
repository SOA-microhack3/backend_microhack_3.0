import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { TerminalsService } from './terminals.service';
import { CreateTerminalDto, UpdateTerminalDto, TerminalResponseDto, TerminalCapacityDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';

@ApiTags('Terminals')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('terminals')
export class TerminalsController {
    constructor(private readonly terminalsService: TerminalsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all terminals' })
    @ApiQuery({ name: 'portId', required: false })
    @ApiResponse({ status: 200, description: 'List of terminals', type: [TerminalResponseDto] })
    async findAll(@Query('portId') portId?: string): Promise<TerminalResponseDto[]> {
        return this.terminalsService.findAll(portId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get terminal by ID' })
    @ApiResponse({ status: 200, description: 'Terminal found', type: TerminalResponseDto })
    async findOne(@Param('id') id: string): Promise<TerminalResponseDto> {
        return this.terminalsService.findOne(id);
    }

    @Get(':id/capacity')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Get terminal capacity for a date' })
    @ApiQuery({ name: 'date', required: false, description: 'Date in ISO format' })
    @ApiResponse({ status: 200, description: 'Terminal capacity', type: TerminalCapacityDto })
    async getCapacity(
        @Param('id') id: string,
        @Query('date') dateStr?: string,
    ): Promise<TerminalCapacityDto> {
        const date = dateStr ? new Date(dateStr) : new Date();
        return this.terminalsService.getCapacity(id, date);
    }

    @Get(':id/bookings')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Get today\'s bookings for terminal' })
    @ApiResponse({ status: 200, description: 'List of bookings' })
    async getTodayBookings(@Param('id') id: string): Promise<any[]> {
        return this.terminalsService.getTodayBookings(id);
    }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new terminal (Admin only)' })
    @ApiResponse({ status: 201, description: 'Terminal created', type: TerminalResponseDto })
    async create(@Body() createTerminalDto: CreateTerminalDto): Promise<TerminalResponseDto> {
        return this.terminalsService.create(createTerminalDto);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Update terminal capacity' })
    @ApiResponse({ status: 200, description: 'Terminal updated', type: TerminalResponseDto })
    async update(
        @Param('id') id: string,
        @Body() updateTerminalDto: UpdateTerminalDto,
    ): Promise<TerminalResponseDto> {
        return this.terminalsService.update(id, updateTerminalDto);
    }
}
