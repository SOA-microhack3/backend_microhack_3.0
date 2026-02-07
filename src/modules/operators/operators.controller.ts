import {
    Controller,
    Get,
    Post,
    Patch,
    Body,
    Param,
    UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { OperatorsService } from './operators.service';
import { CreateOperatorDto, UpdateOperatorStatusDto, OperatorResponseDto } from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole } from '../../common/enums';

@ApiTags('Operators')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('operators')
export class OperatorsController {
    constructor(private readonly operatorsService: OperatorsService) { }

    @Get()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Get all operators (Admin only)' })
    @ApiResponse({ status: 200, type: [OperatorResponseDto] })
    async findAll(): Promise<OperatorResponseDto[]> {
        return this.operatorsService.findAll();
    }

    @Get('me')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Get current operator profile' })
    @ApiResponse({ status: 200, type: OperatorResponseDto })
    async getMe(@CurrentUser('id') userId: string): Promise<OperatorResponseDto> {
        return this.operatorsService.findByUserIdDto(userId);
    }

    @Get(':id')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Get operator by ID' })
    @ApiResponse({ status: 200, type: OperatorResponseDto })
    async findOne(@Param('id') id: string): Promise<OperatorResponseDto> {
        return this.operatorsService.findOne(id);
    }

    @Post()
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Create a new operator (Admin only)' })
    @ApiResponse({ status: 201, type: OperatorResponseDto })
    async create(@Body() createOperatorDto: CreateOperatorDto): Promise<OperatorResponseDto> {
        return this.operatorsService.create(createOperatorDto);
    }

    @Patch(':id/status')
    @Roles(UserRole.ADMIN)
    @ApiOperation({ summary: 'Update operator status (Admin only)' })
    @ApiResponse({ status: 200, type: OperatorResponseDto })
    async updateStatus(
        @Param('id') id: string,
        @Body() updateOperatorStatusDto: UpdateOperatorStatusDto,
    ): Promise<OperatorResponseDto> {
        return this.operatorsService.updateStatus(id, updateOperatorStatusDto);
    }
}
