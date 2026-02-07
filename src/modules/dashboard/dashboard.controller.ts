import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard, RolesGuard } from '../../common/guards';
import { Roles } from '../../common/decorators';
import { UserRole } from '../../common/enums';

@ApiTags('Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('dashboard')
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService) { }

    // Operator Dashboard
    @Get('operator/overview')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Get operator dashboard overview' })
    @ApiQuery({ name: 'terminalId', required: true })
    async getOperatorOverview(@Query('terminalId') terminalId: string): Promise<any> {
        return this.dashboardService.getOperatorOverview(terminalId);
    }

    @Get('operator/pending-approvals')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Get pending booking approvals' })
    @ApiQuery({ name: 'terminalId', required: true })
    async getPendingApprovals(@Query('terminalId') terminalId: string): Promise<any[]> {
        return this.dashboardService.getPendingApprovals(terminalId);
    }

    @Get('operator/today-traffic')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Get today\'s traffic' })
    @ApiQuery({ name: 'terminalId', required: true })
    async getTodayTraffic(@Query('terminalId') terminalId: string): Promise<any[]> {
        return this.dashboardService.getTodayTraffic(terminalId);
    }

    @Get('operator/alerts')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Get operator alerts' })
    @ApiQuery({ name: 'terminalId', required: true })
    async getOperatorAlerts(@Query('terminalId') terminalId: string): Promise<any[]> {
        return this.dashboardService.getOperatorAlerts(terminalId);
    }

    @Get('operator/exceptions')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Detect all exceptions for terminal' })
    @ApiQuery({ name: 'terminalId', required: true })
    @ApiQuery({ name: 'date', required: false })
    async detectExceptions(
        @Query('terminalId') terminalId: string,
        @Query('date') dateStr?: string,
    ): Promise<any[]> {
        const date = dateStr ? new Date(dateStr) : undefined;
        return this.dashboardService.detectExceptions(terminalId, date);
    }

    @Get('operator/exception-summary')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Get exception summary for terminal' })
    @ApiQuery({ name: 'terminalId', required: true })
    async getExceptionSummary(@Query('terminalId') terminalId: string): Promise<any> {
        return this.dashboardService.getExceptionSummary(terminalId);
    }

    @Get('operator/realtime-status')
    @Roles(UserRole.ADMIN, UserRole.OPERATOR)
    @ApiOperation({ summary: 'Get real-time terminal status' })
    @ApiQuery({ name: 'terminalId', required: true })
    async getRealTimeStatus(@Query('terminalId') terminalId: string): Promise<any> {
        return this.dashboardService.getRealTimeTerminalStatus(terminalId);
    }

    // Carrier Dashboard
    @Get('carrier/overview')
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Get carrier dashboard overview' })
    @ApiQuery({ name: 'carrierId', required: true })
    async getCarrierOverview(@Query('carrierId') carrierId: string): Promise<any> {
        return this.dashboardService.getCarrierOverview(carrierId);
    }

    @Get('carrier/upcoming-bookings')
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Get upcoming bookings' })
    @ApiQuery({ name: 'carrierId', required: true })
    async getUpcomingBookings(@Query('carrierId') carrierId: string): Promise<any[]> {
        return this.dashboardService.getUpcomingBookings(carrierId);
    }

    @Get('carrier/fleet-status')
    @Roles(UserRole.ADMIN, UserRole.CARRIER)
    @ApiOperation({ summary: 'Get fleet status' })
    @ApiQuery({ name: 'carrierId', required: true })
    async getFleetStatus(@Query('carrierId') carrierId: string): Promise<any> {
        return this.dashboardService.getFleetStatus(carrierId);
    }
}
