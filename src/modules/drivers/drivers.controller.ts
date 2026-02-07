import {
    Controller,
    Get,
    Post,
    Put,
    Patch,
    Body,
    Param,
    Query,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DriversService } from './drivers.service';
import { CreateDriverDto, UpdateDriverStatusDto, DriverResponseDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole } from '../../common/enums';

@ApiTags('Drivers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('drivers')
export class DriversController {
    constructor(private readonly driversService: DriversService) { }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Get all drivers (filtered by carrier)' })
    @ApiQuery({ name: 'carrierId', required: false })
    @ApiResponse({ status: 200, description: 'List of drivers', type: [DriverResponseDto] })
    async findAll(@Query('carrierId') carrierId?: string): Promise<DriverResponseDto[]> {
        return this.driversService.findAll(carrierId);
    }

    @Get('me')
    @Roles(UserRole.ADMIN, UserRole.DRIVER)
    @ApiOperation({ summary: 'Get current driver profile' })
    @ApiResponse({ status: 200, description: 'Driver found', type: DriverResponseDto })
    async getMe(@CurrentUser('id') userId: string): Promise<DriverResponseDto> {
        return this.driversService.findByUserIdDto(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get driver by ID' })
    @ApiResponse({ status: 200, description: 'Driver found', type: DriverResponseDto })
    async findOne(@Param('id') id: string): Promise<DriverResponseDto> {
        return this.driversService.findOne(id);
    }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Create a new driver' })
    @ApiResponse({ status: 201, description: 'Driver created', type: DriverResponseDto })
    async create(@Body() createDriverDto: CreateDriverDto): Promise<DriverResponseDto> {
        return this.driversService.create(createDriverDto);
    }

    @Patch(':id/status')
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Update driver status' })
    @ApiResponse({ status: 200, description: 'Status updated', type: DriverResponseDto })
    async updateStatus(
        @Param('id') id: string,
        @Body() updateDriverStatusDto: UpdateDriverStatusDto,
    ): Promise<DriverResponseDto> {
        return this.driversService.updateStatus(id, updateDriverStatusDto);
    }
}
