import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import { Booking } from '../bookings/entities/booking.entity';
import { Truck } from '../trucks/entities/truck.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { BookingStatus, TruckStatus, DriverStatus } from '../../common/enums';

@Injectable()
export class DashboardService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        @InjectRepository(Truck)
        private trucksRepository: Repository<Truck>,
        @InjectRepository(Driver)
        private driversRepository: Repository<Driver>,
    ) { }

    // Operator Dashboard
    async getOperatorOverview(terminalId: string): Promise<any> {
        const today = new Date();
        const startOfDay = new Date(today.setHours(0, 0, 0, 0));
        const endOfDay = new Date(today.setHours(23, 59, 59, 999));

        const [todayBookings, pendingCount, confirmedCount, consumedCount] = await Promise.all([
            this.bookingsRepository.count({
                where: { terminalId, slotStart: Between(startOfDay, endOfDay) },
            }),
            this.bookingsRepository.count({
                where: { terminalId, status: BookingStatus.PENDING },
            }),
            this.bookingsRepository.count({
                where: {
                    terminalId,
                    status: BookingStatus.CONFIRMED,
                    slotStart: Between(startOfDay, endOfDay),
                },
            }),
            this.bookingsRepository.count({
                where: {
                    terminalId,
                    status: BookingStatus.CONSUMED,
                    slotStart: Between(startOfDay, endOfDay),
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

    async getPendingApprovals(terminalId: string): Promise<any[]> {
        const bookings = await this.bookingsRepository.find({
            where: { terminalId, status: BookingStatus.PENDING },
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

    async getTodayTraffic(terminalId: string): Promise<any[]> {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const bookings = await this.bookingsRepository.find({
            where: {
                terminalId,
                slotStart: Between(startOfDay, endOfDay),
                status: In([BookingStatus.CONFIRMED, BookingStatus.CONSUMED]),
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

    async getOperatorAlerts(terminalId: string): Promise<any[]> {
        const now = new Date();
        const alerts: any[] = [];

        // Overdue check-ins
        const overdueBookings = await this.bookingsRepository.find({
            where: {
                terminalId,
                status: BookingStatus.CONFIRMED,
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

    // Exception Detection Methods
    async detectExceptions(terminalId: string, date?: Date): Promise<any[]> {
        const targetDate = date || new Date();
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(23, 59, 59, 999);

        const exceptions: any[] = [];

        // Get all bookings for the day
        const bookings = await this.bookingsRepository.find({
            where: {
                terminalId,
                slotStart: Between(startOfDay, endOfDay),
            },
            relations: ['truck', 'driver', 'driver.user', 'carrier', 'terminal'],
        });

        // 1. Capacity overflow detection
        const capacityExceptions = await this.detectCapacityOverflow(terminalId, bookings);
        exceptions.push(...capacityExceptions);

        // 2. Duplicate bookings detection
        const duplicateExceptions = this.detectDuplicateBookings(bookings);
        exceptions.push(...duplicateExceptions);

        // 3. Late/early booking detection
        const timeExceptions = this.detectTimeExceptions(bookings);
        exceptions.push(...timeExceptions);

        return exceptions;
    }

    private async detectCapacityOverflow(terminalId: string, bookings: Booking[]): Promise<any[]> {
        const exceptions: any[] = [];

        // Group bookings by slot
        const slotGroups = new Map<string, Booking[]>();
        bookings.forEach(b => {
            const slotKey = b.slotStart.toISOString();
            if (!slotGroups.has(slotKey)) {
                slotGroups.set(slotKey, []);
            }
            slotGroups.get(slotKey)!.push(b);
        });

        // Get terminal capacity
        const terminal = await this.bookingsRepository.manager.findOne('Terminal', {
            where: { id: terminalId }
        }) as any;

        const maxCapacity = terminal?.maxCapacity || 10;

        slotGroups.forEach((slotBookings, slotKey) => {
            if (slotBookings.length > maxCapacity) {
                exceptions.push({
                    type: 'CAPACITY_OVERFLOW',
                    severity: 'HIGH',
                    message: `Slot ${new Date(slotKey).toLocaleTimeString()} has ${slotBookings.length}/${maxCapacity} bookings`,
                    slotStart: slotKey,
                    bookings: slotBookings.map(b => ({
                        id: b.id,
                        reference: b.bookingReference,
                        truck: b.truck?.plateNumber,
                    })),
                    excessCount: slotBookings.length - maxCapacity,
                });
            }
        });

        return exceptions;
    }

    private detectDuplicateBookings(bookings: Booking[]): any[] {
        const exceptions: any[] = [];
        const truckSlots = new Map<string, Booking[]>();

        bookings.forEach(b => {
            if (!b.truck) return;
            const key = `${b.truck.id}-${b.slotStart.toISOString()}`;
            if (!truckSlots.has(key)) {
                truckSlots.set(key, []);
            }
            truckSlots.get(key)!.push(b);
        });

        truckSlots.forEach((dupes, key) => {
            if (dupes.length > 1) {
                exceptions.push({
                    type: 'DUPLICATE_BOOKING',
                    severity: 'HIGH',
                    message: `Truck ${dupes[0].truck?.plateNumber} has ${dupes.length} overlapping bookings`,
                    bookings: dupes.map(b => ({
                        id: b.id,
                        reference: b.bookingReference,
                        slotStart: b.slotStart,
                    })),
                });
            }
        });

        return exceptions;
    }

    private detectTimeExceptions(bookings: Booking[]): any[] {
        const exceptions: any[] = [];
        const now = new Date();
        const operationalStart = 6; // 6 AM
        const operationalEnd = 22; // 10 PM

        bookings.forEach(b => {
            const slotHour = b.slotStart.getHours();

            // Outside operational hours
            if (slotHour < operationalStart || slotHour >= operationalEnd) {
                exceptions.push({
                    type: 'OUTSIDE_OPERATIONAL_HOURS',
                    severity: 'MEDIUM',
                    message: `Booking ${b.bookingReference} scheduled outside operational hours`,
                    bookingId: b.id,
                    bookingReference: b.bookingReference,
                    slotStart: b.slotStart,
                });
            }

            // Late booking (past the slot time and not consumed)
            if (b.slotEnd < now && b.status === BookingStatus.CONFIRMED) {
                exceptions.push({
                    type: 'LATE_ARRIVAL',
                    severity: 'WARNING',
                    message: `Booking ${b.bookingReference} - truck did not arrive on time`,
                    bookingId: b.id,
                    bookingReference: b.bookingReference,
                    slotStart: b.slotStart,
                    slotEnd: b.slotEnd,
                });
            }
        });

        return exceptions;
    }

    async getExceptionSummary(terminalId: string): Promise<any> {
        const today = new Date();
        const exceptions = await this.detectExceptions(terminalId, today);

        const summary = {
            total: exceptions.length,
            byType: {} as Record<string, number>,
            bySeverity: {
                HIGH: 0,
                MEDIUM: 0,
                WARNING: 0,
            } as Record<string, number>,
        };

        exceptions.forEach(e => {
            summary.byType[e.type] = (summary.byType[e.type] || 0) + 1;
            summary.bySeverity[e.severity] = (summary.bySeverity[e.severity] || 0) + 1;
        });

        return summary;
    }

    async getRealTimeTerminalStatus(terminalId: string): Promise<any> {
        const now = new Date();
        const startOfDay = new Date(now);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(now);
        endOfDay.setHours(23, 59, 59, 999);

        // Get all bookings for today
        const todayBookings = await this.bookingsRepository.find({
            where: {
                terminalId,
                slotStart: Between(startOfDay, endOfDay),
            },
            relations: ['truck', 'driver', 'driver.user'],
        });

        // Current slot (within 30 minutes window)
        const currentSlotStart = new Date(now);
        currentSlotStart.setMinutes(Math.floor(now.getMinutes() / 30) * 30, 0, 0);
        const currentSlotEnd = new Date(currentSlotStart);
        currentSlotEnd.setMinutes(currentSlotEnd.getMinutes() + 30);

        const currentSlotBookings = todayBookings.filter(b =>
            b.slotStart >= currentSlotStart && b.slotStart < currentSlotEnd
        );

        // Upcoming (next 2 hours)
        const upcomingEnd = new Date(now);
        upcomingEnd.setHours(upcomingEnd.getHours() + 2);
        const upcomingBookings = todayBookings.filter(b =>
            b.slotStart > now && b.slotStart <= upcomingEnd
        );

        // Count by status
        const statusCounts = {
            pending: todayBookings.filter(b => b.status === BookingStatus.PENDING).length,
            confirmed: todayBookings.filter(b => b.status === BookingStatus.CONFIRMED).length,
            consumed: todayBookings.filter(b => b.status === BookingStatus.CONSUMED).length,
            cancelled: todayBookings.filter(b => b.status === BookingStatus.CANCELLED).length,
        };

        return {
            terminalId,
            timestamp: now,
            currentSlot: {
                start: currentSlotStart,
                end: currentSlotEnd,
                trucksInSlot: currentSlotBookings.length,
                bookings: currentSlotBookings.map(b => ({
                    id: b.id,
                    reference: b.bookingReference,
                    status: b.status,
                    truck: b.truck?.plateNumber,
                    driver: b.driver?.user?.fullName,
                })),
            },
            upcomingArrivals: upcomingBookings.length,
            todaySummary: {
                total: todayBookings.length,
                ...statusCounts,
            },
            utilizationRate: todayBookings.length > 0
                ? Math.round((statusCounts.consumed / todayBookings.length) * 100)
                : 0,
        };
    }

    // Carrier Dashboard
    async getCarrierOverview(carrierId: string): Promise<any> {
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        const [totalBookings, pendingBookings, activeTrucks, activeDrivers] = await Promise.all([
            this.bookingsRepository.count({ where: { carrierId } }),
            this.bookingsRepository.count({
                where: { carrierId, status: BookingStatus.PENDING },
            }),
            this.trucksRepository.count({
                where: { carrierId, status: TruckStatus.ACTIVE },
            }),
            this.driversRepository.count({
                where: { carrierId, status: DriverStatus.ACTIVE },
            }),
        ]);

        const upcomingBookings = await this.bookingsRepository.count({
            where: {
                carrierId,
                status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
                slotStart: Between(startOfDay, new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)),
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

    async getUpcomingBookings(carrierId: string): Promise<any[]> {
        const now = new Date();

        const bookings = await this.bookingsRepository.find({
            where: {
                carrierId,
                status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
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

    async getFleetStatus(carrierId: string): Promise<any> {
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
