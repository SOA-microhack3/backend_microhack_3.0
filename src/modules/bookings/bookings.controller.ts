import {
    Controller,
    Get,
    Post,
    Put,
    Body,
    Param,
    Query,
    UseGuards,
    Req,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
    ApiQuery,
} from '@nestjs/swagger';
import { BookingsService } from './bookings.service';
import {
    CreateBookingDto,
    UpdateBookingDto,
    BookingResponseDto,
    BookingWithDetailsDto,
} from './dto';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles, CurrentUser } from '../../common/decorators';
import { UserRole, BookingStatus } from '../../common/enums';

@ApiTags('Bookings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bookings')
export class BookingsController {
    constructor(private readonly bookingsService: BookingsService) { }

    @Get()
    @ApiOperation({ summary: 'Get all bookings (role-filtered)' })
    @ApiQuery({ name: 'status', enum: BookingStatus, required: false })
    @ApiQuery({ name: 'carrierId', required: false })
    @ApiQuery({ name: 'terminalId', required: false })
    @ApiResponse({ status: 200, type: [BookingWithDetailsDto] })
    async findAll(
        @Req() req: any,
        @Query('status') status?: BookingStatus,
        @Query('carrierId') carrierId?: string,
        @Query('terminalId') terminalId?: string,
    ): Promise<BookingWithDetailsDto[]> {
        return this.bookingsService.findAll(
            req.user.id,
            req.user.role,
            carrierId,
            terminalId,
            status,
        );
    }

    @Get('availability')
    @ApiOperation({ summary: 'Check slot availability for a terminal' })
    @ApiQuery({ name: 'terminalId', required: true })
    @ApiQuery({ name: 'date', required: false })
    @ApiResponse({ status: 200, description: 'Availability information' })
    async getAvailability(
        @Query('terminalId') terminalId: string,
        @Query('date') dateStr?: string,
    ): Promise<any> {
        const date = dateStr ? new Date(dateStr) : new Date();
        return this.bookingsService.getAvailability(terminalId, date);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get booking by ID' })
    @ApiResponse({ status: 200, type: BookingWithDetailsDto })
    async findOne(@Param('id') id: string): Promise<BookingWithDetailsDto> {
        return this.bookingsService.findOne(id);
    }

    @Post()
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Create a new booking' })
    @ApiResponse({ status: 201, type: BookingResponseDto })
    async create(
        @Body() createBookingDto: CreateBookingDto,
        @Req() req: any,
    ): Promise<BookingResponseDto> {
        // In production, get carrierId from user's carrier association
        // For now, we pass it from the request or look it up
        const carrierId = createBookingDto.carrierId || req.user.carrierId;
        return this.bookingsService.create(createBookingDto, carrierId, req.user.id);
    }

    @Put(':id')
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Update booking' })
    @ApiResponse({ status: 200, type: BookingResponseDto })
    async update(
        @Param('id') id: string,
        @Body() updateBookingDto: UpdateBookingDto,
        @Req() req: any,
    ): Promise<BookingResponseDto> {
        const carrierId = (req.body && req.body.carrierId) || req.user.carrierId;
        return this.bookingsService.update(id, updateBookingDto, carrierId, req.user.id);
    }

    @Post(':id/cancel')
    @ApiOperation({ summary: 'Cancel a booking' })
    @ApiResponse({ status: 200, type: BookingResponseDto })
    async cancel(
        @Param('id') id: string,
        @Req() req: any,
    ): Promise<BookingResponseDto> {
        return this.bookingsService.cancel(id, req.user.id, req.user.role);
    }

    @Post(':id/confirm')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Confirm a booking (Operator action)' })
    @ApiResponse({ status: 200, type: BookingResponseDto })
    async confirm(@Param('id') id: string): Promise<BookingResponseDto> {
        return this.bookingsService.confirm(id);
    }

    @Post(':id/reject')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Reject a booking (Operator action)' })
    @ApiResponse({ status: 200, type: BookingResponseDto })
    async reject(@Param('id') id: string): Promise<BookingResponseDto> {
        return this.bookingsService.reject(id);
    }

    @Post('bulk/confirm')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Bulk confirm bookings (Operator action)' })
    @ApiResponse({ status: 200, description: 'Bookings confirmed' })
    async bulkConfirm(
        @Body() body: { bookingIds: string[] },
        @Req() req: any,
    ): Promise<{ confirmed: number; failed: string[] }> {
        return this.bookingsService.bulkConfirm(body.bookingIds, req.user.id);
    }

    @Post('bulk/reject')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Bulk reject bookings (Operator action)' })
    @ApiResponse({ status: 200, description: 'Bookings rejected' })
    async bulkReject(
        @Body() body: { bookingIds: string[]; reason?: string },
        @Req() req: any,
    ): Promise<{ rejected: number; failed: string[] }> {
        return this.bookingsService.bulkReject(body.bookingIds, body.reason, req.user.id);
    }

    @Post(':id/reassign-slot')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Reassign booking to a different time slot' })
    @ApiResponse({ status: 200, type: BookingResponseDto })
    async reassignSlot(
        @Param('id') id: string,
        @Body() body: { newSlotStart: string },
        @Req() req: any,
    ): Promise<BookingResponseDto> {
        return this.bookingsService.reassignSlot(id, new Date(body.newSlotStart), req.user.id);
    }

    @Post(':id/modify')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Modify booking details (Operator action)' })
    @ApiResponse({ status: 200, type: BookingResponseDto })
    async modifyBooking(
        @Param('id') id: string,
        @Body() body: { truckId?: string; driverId?: string; terminalId?: string; slotStart?: string },
        @Req() req: any,
    ): Promise<BookingResponseDto> {
        const modifications = {
            truckId: body.truckId,
            driverId: body.driverId,
            terminalId: body.terminalId,
            slotStart: body.slotStart ? new Date(body.slotStart) : undefined,
        };
        return this.bookingsService.modifyBookingDetails(id, modifications, req.user.id);
    }

    @Post(':id/override')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Manual override - Approve exception with justification' })
    @ApiResponse({ status: 200, type: BookingResponseDto })
    async manualOverride(
        @Param('id') id: string,
        @Body() body: { reason: string },
        @Req() req: any,
    ): Promise<BookingResponseDto> {
        return this.bookingsService.manualOverride(id, body.reason, req.user.id);
    }

}
