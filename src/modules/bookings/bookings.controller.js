"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const dto_1 = require("./dto");
const guards_1 = require("../../common/guards");
const decorators_1 = require("../../common/decorators");
const enums_1 = require("../../common/enums");
@(0, swagger_1.ApiTags)('Bookings')
@(0, swagger_1.ApiBearerAuth)()
@(0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard)
@(0, common_1.Controller)('bookings')
class BookingsController {
    bookingsService;
    constructor(bookingsService) {
        this.bookingsService = bookingsService;
    }
    @(0, common_1.Get)()
    @(0, swagger_1.ApiOperation)({ summary: 'Get all bookings (role-filtered)' })
    @(0, swagger_1.ApiQuery)({ name: 'status', enum: enums_1.BookingStatus, required: false })
    @(0, swagger_1.ApiQuery)({ name: 'carrierId', required: false })
    @(0, swagger_1.ApiQuery)({ name: 'terminalId', required: false })
    @(0, swagger_1.ApiResponse)({ status: 200, type: [dto_1.BookingWithDetailsDto] })
    async findAll(
    @(0, common_1.Req)()
    req, 
    @(0, common_1.Query)('status')
    status, 
    @(0, common_1.Query)('carrierId')
    carrierId, 
    @(0, common_1.Query)('terminalId')
    terminalId) {
        return this.bookingsService.findAll(req.user.id, req.user.role, carrierId, terminalId, status);
    }
    @(0, common_1.Get)('availability')
    @(0, swagger_1.ApiOperation)({ summary: 'Check slot availability for a terminal' })
    @(0, swagger_1.ApiQuery)({ name: 'terminalId', required: true })
    @(0, swagger_1.ApiQuery)({ name: 'date', required: false })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'Availability information' })
    async getAvailability(
    @(0, common_1.Query)('terminalId')
    terminalId, 
    @(0, common_1.Query)('date')
    dateStr) {
        const date = dateStr ? new Date(dateStr) : new Date();
        return this.bookingsService.getAvailability(terminalId, date);
    }
    @(0, common_1.Get)(':id')
    @(0, swagger_1.ApiOperation)({ summary: 'Get booking by ID' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: dto_1.BookingWithDetailsDto })
    async findOne(
    @(0, common_1.Param)('id')
    id) {
        return this.bookingsService.findOne(id);
    }
    @(0, common_1.Post)()
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Create a new booking' })
    @(0, swagger_1.ApiResponse)({ status: 201, type: dto_1.BookingResponseDto })
    async create(
    @(0, common_1.Body)()
    createBookingDto, 
    @(0, common_1.Req)()
    req) {
        const carrierId = createBookingDto.carrierId || req.user.carrierId;
        return this.bookingsService.create(createBookingDto, carrierId, req.user.id);
    }
    @(0, common_1.Put)(':id')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Update booking' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: dto_1.BookingResponseDto })
    async update(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Body)()
    updateBookingDto, 
    @(0, common_1.Req)()
    req) {
        const carrierId = (req.body && req.body.carrierId) || req.user.carrierId;
        return this.bookingsService.update(id, updateBookingDto, carrierId, req.user.id);
    }
    @(0, common_1.Post)(':id/cancel')
    @(0, swagger_1.ApiOperation)({ summary: 'Cancel a booking' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: dto_1.BookingResponseDto })
    async cancel(
    @(0, common_1.Param)('id')
    id, 
    @(0, common_1.Req)()
    req) {
        return this.bookingsService.cancel(id, req.user.id, req.user.role);
    }
    @(0, common_1.Post)(':id/confirm')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR)
    @(0, swagger_1.ApiOperation)({ summary: 'Confirm a booking (Operator action)' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: dto_1.BookingResponseDto })
    async confirm(
    @(0, common_1.Param)('id')
    id) {
        return this.bookingsService.confirm(id);
    }
    @(0, common_1.Post)(':id/reject')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR)
    @(0, swagger_1.ApiOperation)({ summary: 'Reject a booking (Operator action)' })
    @(0, swagger_1.ApiResponse)({ status: 200, type: dto_1.BookingResponseDto })
    async reject(
    @(0, common_1.Param)('id')
    id) {
        return this.bookingsService.reject(id);
    }
}
exports.BookingsController = BookingsController;
