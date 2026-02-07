import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PortsService } from './ports.service';
import { CreatePortDto, UpdatePortDto, PortResponseDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';

@ApiTags('Ports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('ports')
export class PortsController {
    constructor(private readonly portsService: PortsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all ports' })
    @ApiResponse({ status: 200, description: 'List of ports', type: [PortResponseDto] })
    async findAll(): Promise<PortResponseDto[]> {
        return this.portsService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get port by ID' })
    @ApiResponse({ status: 200, description: 'Port found', type: PortResponseDto })
    @ApiResponse({ status: 404, description: 'Port not found' })
    async findOne(@Param('id') id: string): Promise<PortResponseDto> {
        return this.portsService.findOne(id);
    }

    @Get(':id/terminals')
    @ApiOperation({ summary: 'Get terminals for a port' })
    @ApiResponse({ status: 200, description: 'List of terminals' })
    async getTerminals(@Param('id') id: string): Promise<any[]> {
        return this.portsService.getTerminals(id);
    }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new port (Admin only)' })
    @ApiResponse({ status: 201, description: 'Port created', type: PortResponseDto })
    async create(@Body() createPortDto: CreatePortDto): Promise<PortResponseDto> {
        return this.portsService.create(createPortDto);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update port (Admin only)' })
    @ApiResponse({ status: 200, description: 'Port updated', type: PortResponseDto })
    async update(
        @Param('id') id: string,
        @Body() updatePortDto: UpdatePortDto,
    ): Promise<PortResponseDto> {
        return this.portsService.update(id, updatePortDto);
    }

    @Delete(':id')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Delete port (Admin only)' })
    @ApiResponse({ status: 200, description: 'Port deleted' })
    async remove(@Param('id') id: string): Promise<{ message: string }> {
        await this.portsService.remove(id);
        return { message: 'Port deleted successfully' };
    }
}
