"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../common/enums");
@(0, common_1.Injectable)()
class AiService {
    bookingsRepository;
    terminalsRepository;
    carriersRepository;
    constructor(
    @(0, typeorm_2.InjectRepository)(booking_entity_1.Booking)
    bookingsRepository, 
    @(0, typeorm_2.InjectRepository)(terminal_entity_1.Terminal)
    terminalsRepository, 
    @(0, typeorm_2.InjectRepository)(carrier_entity_1.Carrier)
    carriersRepository) {
        this.bookingsRepository = bookingsRepository;
        this.terminalsRepository = terminalsRepository;
        this.carriersRepository = carriersRepository;
    }
    async getAvailability(terminalName, date, timeRange) {
        let targetDate;
        if (date.toLowerCase() === 'tomorrow') {
            targetDate = new Date();
            targetDate.setDate(targetDate.getDate() + 1);
        }
        else {
            targetDate = new Date(date);
        }
        const terminal = await this.terminalsRepository
            .createQueryBuilder('terminal')
            .leftJoinAndSelect('terminal.port', 'port')
            .where('LOWER(terminal.name) LIKE :name', {
            name: `%${terminalName.toLowerCase()}%`,
        })
            .getOne();
        if (!terminal) {
            return { error: 'Terminal not found', availableTerminals: [] };
        }
        const slotDuration = terminal.port.slotDuration;
        const startOfDay = new Date(targetDate);
        startOfDay.setHours(6, 0, 0, 0);
        const endOfDay = new Date(targetDate);
        endOfDay.setHours(22, 0, 0, 0);
        const bookings = await this.bookingsRepository.find({
            where: {
                terminalId: terminal.id,
                status: (0, typeorm_1.In)([enums_1.BookingStatus.PENDING, enums_1.BookingStatus.CONFIRMED]),
                slotStart: (0, typeorm_1.Between)(startOfDay, endOfDay),
            },
        });
        const slots = [];
        const current = new Date(startOfDay);
        while (current < endOfDay) {
            const slotStart = new Date(current);
            const slotEnd = new Date(current);
            slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);
            const booked = bookings.filter((b) => b.slotStart < slotEnd && b.slotEnd > slotStart).length;
            if (booked < terminal.maxCapacity) {
                slots.push({
                    time: `${slotStart.getHours().toString().padStart(2, '0')}:${slotStart.getMinutes().toString().padStart(2, '0')}-${slotEnd.getHours().toString().padStart(2, '0')}:${slotEnd.getMinutes().toString().padStart(2, '0')}`,
                    available: terminal.maxCapacity - booked,
                    total: terminal.maxCapacity,
                });
            }
            current.setMinutes(current.getMinutes() + slotDuration);
        }
        return {
            terminal: terminal.name,
            port: terminal.port.name,
            date: targetDate.toISOString().split('T')[0],
            slotDuration: `${slotDuration} minutes`,
            availableSlots: slots,
            totalSlotsAvailable: slots.length,
        };
    }
    async getBookingStatus(reference) {
        const booking = await this.bookingsRepository.findOne({
            where: { bookingReference: reference },
            relations: ['truck', 'driver', 'driver.user', 'terminal', 'carrier'],
        });
        if (!booking) {
            return { error: 'Booking not found' };
        }
        return {
            reference: booking.bookingReference,
            status: booking.status,
            carrier: booking.carrier?.name,
            truck: booking.truck?.plateNumber,
            driver: booking.driver?.user?.fullName,
            terminal: booking.terminal?.name,
            scheduledTime: {
                start: booking.slotStart,
                end: booking.slotEnd,
            },
            createdAt: booking.createdAt,
        };
    }
    async getCarrierHistory(carrierId, days = 30) {
        const carrier = await this.carriersRepository.findOne({
            where: { id: carrierId },
        });
        if (!carrier) {
            return { error: 'Carrier not found' };
        }
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const bookings = await this.bookingsRepository.find({
            where: {
                carrierId,
                createdAt: (0, typeorm_1.Between)(startDate, new Date()),
            },
        });
        const stats = {
            totalBookings: bookings.length,
            completed: bookings.filter((b) => b.status === enums_1.BookingStatus.CONSUMED).length,
            cancelled: bookings.filter((b) => b.status === enums_1.BookingStatus.CANCELLED).length,
            rejected: bookings.filter((b) => b.status === enums_1.BookingStatus.REJECTED).length,
            pending: bookings.filter((b) => b.status === enums_1.BookingStatus.PENDING).length,
        };
        return {
            carrier: carrier.name,
            period: `Last ${days} days`,
            statistics: stats,
            completionRate: stats.totalBookings > 0
                ? ((stats.completed / stats.totalBookings) * 100).toFixed(1) + '%'
                : '0%',
        };
    }
    async getBookingSuggestions(carrierId, truckCount, preferredTerminal, preferredDate) {
        const terminal = await this.terminalsRepository
            .createQueryBuilder('terminal')
            .leftJoinAndSelect('terminal.port', 'port')
            .where('LOWER(terminal.name) LIKE :name', {
            name: `%${preferredTerminal.toLowerCase()}%`,
        })
            .getOne();
        if (!terminal) {
            return { error: 'Terminal not found' };
        }
        const targetDate = new Date(preferredDate);
        const availability = await this.getAvailability(preferredTerminal, targetDate.toISOString());
        const suggestions = [];
        const availableSlots = availability.availableSlots || [];
        for (let i = 0; i < Math.min(truckCount, availableSlots.length); i++) {
            const slot = availableSlots[i];
            if (slot && slot.available > 0) {
                suggestions.push({
                    truckNumber: i + 1,
                    suggestedSlot: slot.time,
                    terminal: terminal.name,
                    date: targetDate.toISOString().split('T')[0],
                });
            }
        }
        return {
            carrier: carrierId,
            requestedTrucks: truckCount,
            terminal: terminal.name,
            date: preferredDate,
            suggestions,
            message: suggestions.length === truckCount
                ? 'All trucks can be accommodated'
                : `Only ${suggestions.length} of ${truckCount} trucks can be accommodated`,
        };
    }
}
exports.AiService = AiService;
