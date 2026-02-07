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
import { TrucksService } from './trucks.service';
import { CreateTruckDto, UpdateTruckDto, UpdateTruckStatusDto, TruckResponseDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';

@ApiTags('Trucks')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('trucks')
export class TrucksController {
    constructor(private readonly trucksService: TrucksService) { }

    @Get()
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Get all trucks (filtered by carrier)' })
    @ApiQuery({ name: 'carrierId', required: false })
    @ApiResponse({ status: 200, description: 'List of trucks', type: [TruckResponseDto] })
    async findAll(@Query('carrierId') carrierId?: string): Promise<TruckResponseDto[]> {
        return this.trucksService.findAll(carrierId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get truck by ID' })
    @ApiResponse({ status: 200, description: 'Truck found', type: TruckResponseDto })
    async findOne(@Param('id') id: string): Promise<TruckResponseDto> {
        return this.trucksService.findOne(id);
    }

    @Get(':id/availability')
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Check when truck is free' })
    @ApiQuery({ name: 'date', required: false })
    @ApiResponse({ status: 200, description: 'Truck availability' })
    async getAvailability(
        @Param('id') id: string,
        @Query('date') dateStr?: string,
    ): Promise<any> {
        const date = dateStr ? new Date(dateStr) : new Date();
        return this.trucksService.getAvailability(id, date);
    }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Register a new truck' })
    @ApiResponse({ status: 201, description: 'Truck created', type: TruckResponseDto })
    async create(@Body() createTruckDto: CreateTruckDto): Promise<TruckResponseDto> {
        return this.trucksService.create(createTruckDto);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Update truck' })
    @ApiResponse({ status: 200, description: 'Truck updated', type: TruckResponseDto })
    async update(
        @Param('id') id: string,
        @Body() updateTruckDto: UpdateTruckDto,
    ): Promise<TruckResponseDto> {
        return this.trucksService.update(id, updateTruckDto);
    }

    @Patch(':id/status')
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Update truck status (activate/suspend)' })
    @ApiResponse({ status: 200, description: 'Status updated', type: TruckResponseDto })
    async updateStatus(
        @Param('id') id: string,
        @Body() updateTruckStatusDto: UpdateTruckStatusDto,
    ): Promise<TruckResponseDto> {
        return this.trucksService.updateStatus(id, updateTruckStatusDto);
    }
}
