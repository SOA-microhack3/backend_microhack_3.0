"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../common/enums");
@(0, common_1.Injectable)()
class TerminalsService {
    terminalsRepository;
    bookingsRepository;
    portsRepository;
    constructor(
    @(0, typeorm_2.InjectRepository)(terminal_entity_1.Terminal)
    terminalsRepository, 
    @(0, typeorm_2.InjectRepository)(booking_entity_1.Booking)
    bookingsRepository, 
    @(0, typeorm_2.InjectRepository)(port_entity_1.Port)
    portsRepository) {
        this.terminalsRepository = terminalsRepository;
        this.bookingsRepository = bookingsRepository;
        this.portsRepository = portsRepository;
    }
    async findAll(portId) {
        const where = portId ? { portId } : {};
        const terminals = await this.terminalsRepository.find({
            where,
            order: { name: 'ASC' },
        });
        return terminals.map(this.toResponseDto);
    }
    async findOne(id) {
        const terminal = await this.terminalsRepository.findOne({ where: { id } });
        if (!terminal) {
            throw new common_1.NotFoundException('Terminal not found');
        }
        return this.toResponseDto(terminal);
    }
    async findOneEntity(id) {
        const terminal = await this.terminalsRepository.findOne({
            where: { id },
            relations: ['port'],
        });
        if (!terminal) {
            throw new common_1.NotFoundException('Terminal not found');
        }
        return terminal;
    }
    async create(createTerminalDto) {
        const port = await this.portsRepository.findOne({
            where: { id: createTerminalDto.portId },
        });
        if (!port) {
            throw new common_1.NotFoundException('Port not found');
        }
        const terminal = this.terminalsRepository.create(createTerminalDto);
        await this.terminalsRepository.save(terminal);
        return this.toResponseDto(terminal);
    }
    async update(id, updateTerminalDto) {
        const terminal = await this.terminalsRepository.findOne({ where: { id } });
        if (!terminal) {
            throw new common_1.NotFoundException('Terminal not found');
        }
        Object.assign(terminal, updateTerminalDto);
        await this.terminalsRepository.save(terminal);
        return this.toResponseDto(terminal);
    }
    async getCapacity(id, date) {
        const terminal = await this.terminalsRepository.findOne({
            where: { id },
            relations: ['port'],
        });
        if (!terminal) {
            throw new common_1.NotFoundException('Terminal not found');
        }
        const slotDuration = terminal.port.slotDuration;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const bookings = await this.bookingsRepository.find({
            where: {
                terminalId: id,
                slotStart: (0, typeorm_1.Between)(startOfDay, endOfDay),
                status: enums_1.BookingStatus.CONFIRMED,
            },
        });
        const slots = [];
        const currentSlotStart = new Date(startOfDay);
        currentSlotStart.setHours(6, 0, 0, 0);
        while (currentSlotStart.getHours() < 22) {
            const slotStart = new Date(currentSlotStart);
            const slotEnd = new Date(currentSlotStart);
            slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);
            const bookedCount = bookings.filter((booking) => {
                return booking.slotStart <= slotStart && booking.slotEnd > slotStart;
            }).length;
            slots.push({
                slotStart,
                slotEnd,
                bookedCount,
                availableCount: terminal.maxCapacity - bookedCount,
            });
            currentSlotStart.setMinutes(currentSlotStart.getMinutes() + slotDuration);
        }
        return {
            terminalId: terminal.id,
            terminalName: terminal.name,
            maxCapacity: terminal.maxCapacity,
            slots,
        };
    }
    async getTodayBookings(id) {
        const terminal = await this.terminalsRepository.findOne({ where: { id } });
        if (!terminal) {
            throw new common_1.NotFoundException('Terminal not found');
        }
        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);
        return this.bookingsRepository.find({
            where: {
                terminalId: id,
                slotStart: (0, typeorm_1.Between)(startOfDay, endOfDay),
            },
            relations: ['truck', 'driver', 'carrier'],
            order: { slotStart: 'ASC' },
        });
    }
    toResponseDto(terminal) {
        return {
            id: terminal.id,
            name: terminal.name,
            portId: terminal.portId,
            maxCapacity: terminal.maxCapacity,
            createdAt: terminal.createdAt,
        };
    }
}
exports.TerminalsService = TerminalsService;
