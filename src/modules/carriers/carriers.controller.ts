import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CarriersService } from './carriers.service';
import { CreateCarrierDto, UpdateCarrierDto, CarrierResponseDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole } from '../../common/enums';

@ApiTags('Carriers')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('carriers')
export class CarriersController {
    constructor(private readonly carriersService: CarriersService) { }

    @Get()
    @ApiOperation({ summary: 'Get all carriers' })
    @ApiResponse({ status: 200, description: 'List of carriers', type: [CarrierResponseDto] })
    async findAll(): Promise<CarrierResponseDto[]> {
        return this.carriersService.findAll();
    }

    @Get('me')
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Get current carrier profile' })
    @ApiResponse({ status: 200, description: 'Carrier found', type: CarrierResponseDto })
    async getMe(@CurrentUser('id') userId: string): Promise<CarrierResponseDto> {
        return this.carriersService.findByUserIdDto(userId);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get carrier by ID' })
    @ApiResponse({ status: 200, description: 'Carrier found', type: CarrierResponseDto })
    async findOne(@Param('id') id: string): Promise<CarrierResponseDto> {
        return this.carriersService.findOne(id);
    }

    @Get(':id/trucks')
    @ApiOperation({ summary: 'Get carrier\'s trucks' })
    @ApiResponse({ status: 200, description: 'List of trucks' })
    async getTrucks(@Param('id') id: string): Promise<any[]> {
        return this.carriersService.getTrucks(id);
    }

    @Get(':id/drivers')
    @ApiOperation({ summary: 'Get carrier\'s drivers' })
    @ApiResponse({ status: 200, description: 'List of drivers' })
    async getDrivers(@Param('id') id: string): Promise<any[]> {
        return this.carriersService.getDrivers(id);
    }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new carrier (Admin only)' })
    @ApiResponse({ status: 201, description: 'Carrier created', type: CarrierResponseDto })
    async create(@Body() createCarrierDto: CreateCarrierDto): Promise<CarrierResponseDto> {
        return this.carriersService.create(createCarrierDto);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Update carrier' })
    @ApiResponse({ status: 200, description: 'Carrier updated', type: CarrierResponseDto })
    async update(
        @Param('id') id: string,
        @Body() updateCarrierDto: UpdateCarrierDto,
    ): Promise<CarrierResponseDto> {
        return this.carriersService.update(id, updateCarrierDto);
    }
}
