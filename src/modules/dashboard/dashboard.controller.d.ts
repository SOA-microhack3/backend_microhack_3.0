import { DashboardService } from './dashboard.service';
export declare class DashboardController {
    private readonly dashboardService;
    constructor(dashboardService: DashboardService);
    getOperatorOverview(terminalId: string): Promise<any>;
    getPendingApprovals(terminalId: string): Promise<any[]>;
    getTodayTraffic(terminalId: string): Promise<any[]>;
    getOperatorAlerts(terminalId: string): Promise<any[]>;
    getCarrierOverview(carrierId: string): Promise<any>;
    getUpcomingBookings(carrierId: string): Promise<any[]>;
    getFleetStatus(carrierId: string): Promise<any>;
}
