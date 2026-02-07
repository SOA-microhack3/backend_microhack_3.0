"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../../common/guards");
const decorators_1 = require("../../common/decorators");
const enums_1 = require("../../common/enums");
@(0, swagger_1.ApiTags)('Dashboard')
@(0, swagger_1.ApiBearerAuth)()
@(0, common_1.UseGuards)(guards_1.JwtAuthGuard, guards_1.RolesGuard)
@(0, common_1.Controller)('dashboard')
class DashboardController {
    dashboardService;
    constructor(dashboardService) {
        this.dashboardService = dashboardService;
    }
    @(0, common_1.Get)('operator/overview')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR)
    @(0, swagger_1.ApiOperation)({ summary: 'Get operator dashboard overview' })
    @(0, swagger_1.ApiQuery)({ name: 'terminalId', required: true })
    async getOperatorOverview(
    @(0, common_1.Query)('terminalId')
    terminalId) {
        return this.dashboardService.getOperatorOverview(terminalId);
    }
    @(0, common_1.Get)('operator/pending-approvals')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR)
    @(0, swagger_1.ApiOperation)({ summary: 'Get pending booking approvals' })
    @(0, swagger_1.ApiQuery)({ name: 'terminalId', required: true })
    async getPendingApprovals(
    @(0, common_1.Query)('terminalId')
    terminalId) {
        return this.dashboardService.getPendingApprovals(terminalId);
    }
    @(0, common_1.Get)('operator/today-traffic')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR)
    @(0, swagger_1.ApiOperation)({ summary: 'Get today\'s traffic' })
    @(0, swagger_1.ApiQuery)({ name: 'terminalId', required: true })
    async getTodayTraffic(
    @(0, common_1.Query)('terminalId')
    terminalId) {
        return this.dashboardService.getTodayTraffic(terminalId);
    }
    @(0, common_1.Get)('operator/alerts')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.OPERATOR)
    @(0, swagger_1.ApiOperation)({ summary: 'Get operator alerts' })
    @(0, swagger_1.ApiQuery)({ name: 'terminalId', required: true })
    async getOperatorAlerts(
    @(0, common_1.Query)('terminalId')
    terminalId) {
        return this.dashboardService.getOperatorAlerts(terminalId);
    }
    @(0, common_1.Get)('carrier/overview')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Get carrier dashboard overview' })
    @(0, swagger_1.ApiQuery)({ name: 'carrierId', required: true })
    async getCarrierOverview(
    @(0, common_1.Query)('carrierId')
    carrierId) {
        return this.dashboardService.getCarrierOverview(carrierId);
    }
    @(0, common_1.Get)('carrier/upcoming-bookings')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Get upcoming bookings' })
    @(0, swagger_1.ApiQuery)({ name: 'carrierId', required: true })
    async getUpcomingBookings(
    @(0, common_1.Query)('carrierId')
    carrierId) {
        return this.dashboardService.getUpcomingBookings(carrierId);
    }
    @(0, common_1.Get)('carrier/fleet-status')
    @(0, decorators_1.Roles)(enums_1.UserRole.ADMIN, enums_1.UserRole.CARRIER)
    @(0, swagger_1.ApiOperation)({ summary: 'Get fleet status' })
    @(0, swagger_1.ApiQuery)({ name: 'carrierId', required: true })
    async getFleetStatus(
    @(0, common_1.Query)('carrierId')
    carrierId) {
        return this.dashboardService.getFleetStatus(carrierId);
    }
}
exports.DashboardController = DashboardController;
