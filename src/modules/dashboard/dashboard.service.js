"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../common/enums");
@(0, common_1.Injectable)()
class DashboardService {
    bookingsRepository;
    trucksRepository;
    driversRepository;
    constructor(
    @(0, typeorm_2.InjectRepository)(booking_entity_1.Booking)
    bookingsRepository, 
    @(0, typeorm_2.InjectRepository)(truck_entity_1.Truck)
    trucksRepository, 
    @(0, typeorm_2.InjectRepository)(driver_entity_1.Driver)
    driversRepository) {
        this.bookingsRepository = bookingsRepository;
        this.trucksRepository = trucksRepository;
        this.driversRepository = driversRepository;
    }
    async getOperatorOverview(terminalId) {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));
        const [todayBookings, pendingCount, confirmedCount, consumedCount] = await Promise.all([
            this.bookingsRepository.count({
                where: { terminalId, slotStart: (0, typeorm_1.Between)(startOfDay, endOfDay) },
            }),
            this.bookingsRepository.count({
                where: { terminalId, status: enums_1.BookingStatus.PENDING },
            }),
            this.bookingsRepository.count({
                where: {
                    terminalId,
                    status: enums_1.BookingStatus.CONFIRMED,
                    slotStart: (0, typeorm_1.Between)(startOfDay, endOfDay),
                },
            }),
            this.bookingsRepository.count({
                where: {
                    terminalId,
                    status: enums_1.BookingStatus.CONSUMED,
                    slotStart: (0, typeorm_1.Between)(startOfDay, endOfDay),
                },
            }),
        ]);
        return {
            todayBookings,
            pendingApprovals: pendingCount,
            confirmedToday: confirmedCount,
            consumedToday: consumedCount,
            utilizationRate: todayBookings > 0 ? (consumedCount / todayBookings) * 100 : 0,
        };
    }
    async getPendingApprovals(terminalId) {
        const bookings = await this.bookingsRepository.find({
            where: { terminalId, status: enums_1.BookingStatus.PENDING },
            relations: ['truck', 'driver', 'driver.user', 'carrier'],
            order: { createdAt: 'ASC' },
            take: 20,
        });
        return bookings.map((b) => ({
            id: b.id,
            bookingReference: b.bookingReference,
            truckPlate: b.truck?.plateNumber,
            driverName: b.driver?.user?.fullName,
            carrierName: b.carrier?.name,
            slotStart: b.slotStart,
            slotEnd: b.slotEnd,
            createdAt: b.createdAt,
        }));
    }
    async getTodayTraffic(terminalId) {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        const bookings = await this.bookingsRepository.find({
            where: {
                terminalId,
                slotStart: (0, typeorm_1.Between)(startOfDay, endOfDay),
                status: (0, typeorm_1.In)([enums_1.BookingStatus.CONFIRMED, enums_1.BookingStatus.CONSUMED]),
            },
            relations: ['truck', 'driver', 'driver.user'],
            order: { slotStart: 'ASC' },
        });
        return bookings.map((b) => ({
            id: b.id,
            bookingReference: b.bookingReference,
            status: b.status,
            truckPlate: b.truck?.plateNumber,
            driverName: b.driver?.user?.fullName,
            slotStart: b.slotStart,
            slotEnd: b.slotEnd,
        }));
    }
    async getOperatorAlerts(terminalId) {
        const now = new Date();
        const alerts = [];
        const overdueBookings = await this.bookingsRepository.find({
            where: {
                terminalId,
                status: enums_1.BookingStatus.CONFIRMED,
            },
            relations: ['truck'],
        });
        overdueBookings.forEach((b) => {
            if (b.slotEnd < now) {
                alerts.push({
                    type: 'OVERDUE',
                    severity: 'WARNING',
                    message: `Booking ${b.bookingReference} (${b.truck?.plateNumber}) has not checked in`,
                    bookingId: b.id,
                });
            }
        });
        return alerts;
    }
    async getCarrierOverview(carrierId) {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        const [totalBookings, pendingBookings, activeTrucks, activeDrivers] = await Promise.all([
            this.bookingsRepository.count({ where: { carrierId } }),
            this.bookingsRepository.count({
                where: { carrierId, status: enums_1.BookingStatus.PENDING },
            }),
            this.trucksRepository.count({
                where: { carrierId, status: enums_1.TruckStatus.ACTIVE },
            }),
            this.driversRepository.count({
                where: { carrierId, status: enums_1.DriverStatus.ACTIVE },
            }),
        ]);
        const upcomingBookings = await this.bookingsRepository.count({
            where: {
                carrierId,
                status: (0, typeorm_1.In)([enums_1.BookingStatus.PENDING, enums_1.BookingStatus.CONFIRMED]),
                slotStart: (0, typeorm_1.Between)(startOfDay, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
            },
        });
        return {
            totalBookings,
            pendingBookings,
            upcomingBookings,
            activeTrucks,
            activeDrivers,
        };
    }
    async getUpcomingBookings(carrierId) {
        const now = new Date();
        const bookings = await this.bookingsRepository.find({
            where: {
                carrierId,
                status: (0, typeorm_1.In)([enums_1.BookingStatus.PENDING, enums_1.BookingStatus.CONFIRMED]),
            },
            relations: ['truck', 'driver', 'driver.user', 'terminal'],
            order: { slotStart: 'ASC' },
            take: 20,
        });
        return bookings
            .filter((b) => b.slotStart >= now)
            .map((b) => ({
            id: b.id,
            bookingReference: b.bookingReference,
            status: b.status,
            truckPlate: b.truck?.plateNumber,
            driverName: b.driver?.user?.fullName,
            terminalName: b.terminal?.name,
            slotStart: b.slotStart,
            slotEnd: b.slotEnd,
        }));
    }
    async getFleetStatus(carrierId) {
        const [trucks, drivers] = await Promise.all([
            this.trucksRepository.find({ where: { carrierId } }),
            this.driversRepository.find({
                where: { carrierId },
                relations: ['user'],
            }),
        ]);
        return {
            trucks: trucks.map((t) => ({
                id: t.id,
                plateNumber: t.plateNumber,
                status: t.status,
            })),
            drivers: drivers.map((d) => ({
                id: d.id,
                name: d.user?.fullName,
                status: d.status,
            })),
        };
    }
}
exports.DashboardService = DashboardService;
