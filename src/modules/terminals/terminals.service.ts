import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Terminal } from './entities/terminal.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Port } from '../ports/entities/port.entity';
import {
    CreateTerminalDto,
    UpdateTerminalDto,
    TerminalResponseDto,
    TerminalCapacityDto,
    SlotCapacityDto,
} from './dto';
import { BookingStatus } from '../../common/enums';

@Injectable()
export class TerminalsService {
    constructor(
        @InjectRepository(Terminal)
        private terminalsRepository: Repository<Terminal>,
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        @InjectRepository(Port)
        private portsRepository: Repository<Port>,
    ) { }

    async findAll(portId?: string): Promise<TerminalResponseDto[]> {
        const where = portId ? { portId } : {};
        const terminals = await this.terminalsRepository.find({
            where,
            order: { name: 'ASC' },
        });
        return terminals.map(this.toResponseDto);
    }

    async findOne(id: string): Promise<TerminalResponseDto> {
        const terminal = await this.terminalsRepository.findOne({ where: { id } });
        if (!terminal) {
            throw new NotFoundException('Terminal not found');
        }
        return this.toResponseDto(terminal);
    }

    async findOneEntity(id: string): Promise<Terminal> {
        const terminal = await this.terminalsRepository.findOne({
            where: { id },
            relations: ['port'],
        });
        if (!terminal) {
            throw new NotFoundException('Terminal not found');
        }
        return terminal;
    }

    async create(createTerminalDto: CreateTerminalDto): Promise<TerminalResponseDto> {
        const port = await this.portsRepository.findOne({
            where: { id: createTerminalDto.portId },
        });
        if (!port) {
            throw new NotFoundException('Port not found');
        }

        const terminal = this.terminalsRepository.create(createTerminalDto);
        await this.terminalsRepository.save(terminal);
        return this.toResponseDto(terminal);
    }

    async update(id: string, updateTerminalDto: UpdateTerminalDto): Promise<TerminalResponseDto> {
        const terminal = await this.terminalsRepository.findOne({ where: { id } });
        if (!terminal) {
            throw new NotFoundException('Terminal not found');
        }

        Object.assign(terminal, updateTerminalDto);
        await this.terminalsRepository.save(terminal);
        return this.toResponseDto(terminal);
    }

    async getCapacity(id: string, date: Date): Promise<TerminalCapacityDto> {
        const terminal = await this.terminalsRepository.findOne({
            where: { id },
            relations: ['port'],
        });
        if (!terminal) {
            throw new NotFoundException('Terminal not found');
        }

        const slotDuration = terminal.port.slotDuration;
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        // Get all bookings for this terminal on the given date
        const bookings = await this.bookingsRepository.find({
            where: {
                terminalId: id,
                slotStart: Between(startOfDay, endOfDay),
                status: BookingStatus.CONFIRMED,
            },
        });

        // Generate slots for the day
        const slots: SlotCapacityDto[] = [];
        const currentSlotStart = new Date(startOfDay);
        currentSlotStart.setHours(6, 0, 0, 0); // Start at 6 AM

        while (currentSlotStart.getHours() < 22) { // Until 10 PM
            const slotStart = new Date(currentSlotStart);
            const slotEnd = new Date(currentSlotStart);
            slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

            // Count bookings that overlap with this slot
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

    async getTodayBookings(id: string): Promise<Booking[]> {
        const terminal = await this.terminalsRepository.findOne({ where: { id } });
        if (!terminal) {
            throw new NotFoundException('Terminal not found');
        }

        const today = new Date();
        const startOfDay = new Date(today);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(today);
        endOfDay.setHours(23, 59, 59, 999);

        return this.bookingsRepository.find({
            where: {
                terminalId: id,
                slotStart: Between(startOfDay, endOfDay),
            },
            relations: ['truck', 'driver', 'carrier'],
            order: { slotStart: 'ASC' },
        });
    }

    private toResponseDto(terminal: Terminal): TerminalResponseDto {
        return {
            id: terminal.id,
            name: terminal.name,
            portId: terminal.portId,
            maxCapacity: terminal.maxCapacity,
            createdAt: terminal.createdAt,
        };
    }
}
