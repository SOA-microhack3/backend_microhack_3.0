"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const booking_entity_1 = require("./entities/booking.entity");
const terminal_entity_1 = require("../terminals/entities/terminal.entity");
const port_entity_1 = require("../ports/entities/port.entity");
const truck_entity_1 = require("../trucks/entities/truck.entity");
const driver_entity_1 = require("../drivers/entities/driver.entity");
const enums_1 = require("../../common/enums");
@(0, common_1.Injectable)()
class BookingsService {
    bookingsRepository;
    terminalsRepository;
    trucksRepository;
    driversRepository;
    carriersRepository;
    operatorsRepository;
    notificationsService;
    dataSource;
    constructor(
    @(0, typeorm_2.InjectRepository)(booking_entity_1.Booking)
    bookingsRepository, 
    @(0, typeorm_2.InjectRepository)(terminal_entity_1.Terminal)
    terminalsRepository, 
    @(0, typeorm_2.InjectRepository)(truck_entity_1.Truck)
    trucksRepository, 
    @(0, typeorm_2.InjectRepository)(driver_entity_1.Driver)
    driversRepository, 
    @(0, typeorm_2.InjectRepository)(carrier_entity_1.Carrier)
    carriersRepository, 
    @(0, typeorm_2.InjectRepository)(operator_entity_1.Operator)
    operatorsRepository, notificationsService, dataSource) {
        this.bookingsRepository = bookingsRepository;
        this.terminalsRepository = terminalsRepository;
        this.trucksRepository = trucksRepository;
        this.driversRepository = driversRepository;
        this.carriersRepository = carriersRepository;
        this.operatorsRepository = operatorsRepository;
        this.notificationsService = notificationsService;
        this.dataSource = dataSource;
    }
    async findAll(userId, userRole, carrierId, terminalId, status) {
        const queryBuilder = this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.truck', 'truck')
            .leftJoinAndSelect('booking.driver', 'driver')
            .leftJoinAndSelect('driver.user', 'driverUser')
            .leftJoinAndSelect('booking.terminal', 'terminal')
            .orderBy('booking.slotStart', 'ASC');
        if (userRole === enums_1.UserRole.CARRIER) {
            let resolvedCarrierId = carrierId;
            if (!resolvedCarrierId) {
                const carrier = await this.carriersRepository.findOne({
                    where: { userId },
                });
                resolvedCarrierId = carrier?.id;
            }
            if (!resolvedCarrierId) {
                return [];
            }
            queryBuilder.andWhere('booking.carrierId = :carrierId', {
                carrierId: resolvedCarrierId,
            });
        }
        else if (userRole === enums_1.UserRole.OPERATOR) {
            let resolvedTerminalId = terminalId;
            if (!resolvedTerminalId) {
                const operator = await this.operatorsRepository.findOne({
                    where: { userId },
                });
                resolvedTerminalId = operator?.terminalId;
            }
            if (!resolvedTerminalId) {
                return [];
            }
            queryBuilder.andWhere('booking.terminalId = :terminalId', {
                terminalId: resolvedTerminalId,
            });
        }
        else if (userRole === enums_1.UserRole.DRIVER) {
            const driver = await this.driversRepository.findOne({
                where: { userId },
            });
            if (!driver) {
                return [];
            }
            queryBuilder.andWhere('booking.driverId = :driverId', {
                driverId: driver.id,
            });
        }
        if (status) {
            queryBuilder.andWhere('booking.status = :status', { status });
        }
        const bookings = await queryBuilder.getMany();
        return bookings.map((booking) => this.toDetailedResponseDto(booking));
    }
    async findOne(id) {
        const booking = await this.bookingsRepository.findOne({
            where: { id },
            relations: ['truck', 'driver', 'driver.user', 'terminal'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return this.toDetailedResponseDto(booking);
    }
    async findByReference(reference) {
        const booking = await this.bookingsRepository.findOne({
            where: { bookingReference: reference },
            relations: ['truck', 'driver', 'driver.user', 'terminal'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        return this.toDetailedResponseDto(booking);
    }
    async create(createBookingDto, carrierId, userId) {
        let resolvedCarrierId = carrierId;
        if (!resolvedCarrierId) {
            const carrier = await this.carriersRepository.findOne({
                where: { userId },
            });
            resolvedCarrierId = carrier?.id;
        }
        if (!resolvedCarrierId) {
            throw new common_1.BadRequestException('Carrier not found for user');
        }
        return this.dataSource.transaction(async (manager) => {
            const terminal = await manager.findOne(terminal_entity_1.Terminal, {
                where: { id: createBookingDto.terminalId },
                lock: { mode: 'pessimistic_read' },
            });
            if (!terminal) {
                throw new common_1.NotFoundException('Terminal not found');
            }
            const port = await manager.findOne(port_entity_1.Port, {
                where: { id: terminal.portId },
            });
            if (!port) {
                throw new common_1.NotFoundException('Port not found for terminal');
            }
            const truck = await manager.findOne(truck_entity_1.Truck, {
                where: { id: createBookingDto.truckId },
            });
            if (!truck) {
                throw new common_1.NotFoundException('Truck not found');
            }
            if (truck.carrierId !== resolvedCarrierId) {
                throw new common_1.BadRequestException('Truck does not belong to your carrier');
            }
            if (truck.status !== enums_1.TruckStatus.ACTIVE) {
                throw new common_1.BadRequestException('Truck is not active');
            }
            const driver = await manager.findOne(driver_entity_1.Driver, {
                where: { id: createBookingDto.driverId },
            });
            if (!driver) {
                throw new common_1.NotFoundException('Driver not found');
            }
            if (driver.carrierId !== resolvedCarrierId) {
                throw new common_1.BadRequestException('Driver does not belong to your carrier');
            }
            if (driver.status !== enums_1.DriverStatus.ACTIVE) {
                throw new common_1.BadRequestException('Driver is not active');
            }
            const slotDuration = port.slotDuration;
            const slotsCount = createBookingDto.slotsCount || 1;
            const slotStart = new Date(createBookingDto.slotStart);
            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration * slotsCount);
            const existingBookings = await manager
                .createQueryBuilder(booking_entity_1.Booking, 'booking')
                .setLock('pessimistic_write')
                .where('booking.terminalId = :terminalId', {
                terminalId: createBookingDto.terminalId,
            })
                .andWhere('booking.status IN (:...statuses)', {
                statuses: [enums_1.BookingStatus.PENDING, enums_1.BookingStatus.CONFIRMED],
            })
                .andWhere('(booking.slotStart < :slotEnd AND booking.slotEnd > :slotStart)', { slotStart, slotEnd })
                .getMany();
            if (existingBookings.length >= terminal.maxCapacity) {
                throw new common_1.ConflictException('No capacity available for the selected time slot');
            }
            const truckBooking = await manager.findOne(booking_entity_1.Booking, {
                where: {
                    truckId: createBookingDto.truckId,
                    status: (0, typeorm_1.In)([enums_1.BookingStatus.PENDING, enums_1.BookingStatus.CONFIRMED]),
                },
            });
            if (truckBooking) {
                const overlap = truckBooking.slotStart < slotEnd && truckBooking.slotEnd > slotStart;
                if (overlap) {
                    throw new common_1.ConflictException('Truck is already booked for this time');
                }
            }
            const bookingReference = this.generateBookingReference();
            const booking = manager.create(booking_entity_1.Booking, {
                portId: terminal.portId,
                terminalId: createBookingDto.terminalId,
                carrierId: resolvedCarrierId,
                truckId: createBookingDto.truckId,
                driverId: createBookingDto.driverId,
                status: enums_1.BookingStatus.CONFIRMED,
                slotStart,
                slotEnd,
                slotsCount,
                bookingReference,
            });
            await manager.save(booking);
            try {
                const driver = await manager.findOne(driver_entity_1.Driver, {
                    where: { id: booking.driverId },
                });
                if (driver?.userId) {
                    await this.notificationsService.create({
                        userId: driver.userId,
                        type: enums_1.NotificationType.PUSH,
                        source: enums_1.NotificationSource.SYSTEM,
                        message: `Booking ${booking.bookingReference} confirmed. Your QR code is available.`,
                    });
                }
            }
            catch {
            }
            return this.toResponseDto(booking);
        });
    }
    async update(id, updateBookingDto, carrierId, userId) {
        let resolvedCarrierId = carrierId;
        if (!resolvedCarrierId) {
            const carrier = await this.carriersRepository.findOne({
                where: { userId },
            });
            resolvedCarrierId = carrier?.id;
        }
        if (!resolvedCarrierId) {
            throw new common_1.BadRequestException('Carrier not found for user');
        }
        const booking = await this.bookingsRepository.findOne({
            where: { id },
            relations: ['terminal', 'terminal.port'],
        });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.carrierId !== resolvedCarrierId) {
            throw new common_1.BadRequestException('Booking does not belong to your carrier');
        }
        if (booking.status !== enums_1.BookingStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending bookings can be modified');
        }
        if (updateBookingDto.truckId) {
            const truck = await this.trucksRepository.findOne({
                where: { id: updateBookingDto.truckId },
            });
            if (!truck || truck.carrierId !== resolvedCarrierId) {
                throw new common_1.BadRequestException('Invalid truck');
            }
            booking.truckId = updateBookingDto.truckId;
        }
        if (updateBookingDto.driverId) {
            const driver = await this.driversRepository.findOne({
                where: { id: updateBookingDto.driverId },
            });
            if (!driver || driver.carrierId !== resolvedCarrierId) {
                throw new common_1.BadRequestException('Invalid driver');
            }
            booking.driverId = updateBookingDto.driverId;
        }
        if (updateBookingDto.slotStart) {
            const slotDuration = booking.terminal.port.slotDuration;
            booking.slotStart = new Date(updateBookingDto.slotStart);
            booking.slotEnd = new Date(booking.slotStart);
            booking.slotEnd.setMinutes(booking.slotEnd.getMinutes() + slotDuration * booking.slotsCount);
        }
        await this.bookingsRepository.save(booking);
        return this.toResponseDto(booking);
    }
    async cancel(id, userId, userRole) {
        const booking = await this.bookingsRepository.findOne({ where: { id } });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (![enums_1.BookingStatus.PENDING, enums_1.BookingStatus.CONFIRMED].includes(booking.status)) {
            throw new common_1.BadRequestException('Booking cannot be cancelled');
        }
        booking.status = enums_1.BookingStatus.CANCELLED;
        await this.bookingsRepository.save(booking);
        return this.toResponseDto(booking);
    }
    async confirm(id) {
        const booking = await this.bookingsRepository.findOne({ where: { id } });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== enums_1.BookingStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending bookings can be confirmed');
        }
        booking.status = enums_1.BookingStatus.CONFIRMED;
        await this.bookingsRepository.save(booking);
        try {
            const driver = await this.driversRepository.findOne({
                where: { id: booking.driverId },
            });
            if (driver?.userId) {
                await this.notificationsService.create({
                    userId: driver.userId,
                    type: enums_1.NotificationType.PUSH,
                    source: enums_1.NotificationSource.SYSTEM,
                    message: `Booking ${booking.bookingReference} confirmed. Your QR code is available.`,
                });
            }
        }
        catch {
        }
        return this.toResponseDto(booking);
    }
    async reject(id) {
        const booking = await this.bookingsRepository.findOne({ where: { id } });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== enums_1.BookingStatus.PENDING) {
            throw new common_1.BadRequestException('Only pending bookings can be rejected');
        }
        booking.status = enums_1.BookingStatus.REJECTED;
        await this.bookingsRepository.save(booking);
        return this.toResponseDto(booking);
    }
    async markConsumed(id) {
        const booking = await this.bookingsRepository.findOne({ where: { id } });
        if (!booking) {
            throw new common_1.NotFoundException('Booking not found');
        }
        if (booking.status !== enums_1.BookingStatus.CONFIRMED) {
            throw new common_1.BadRequestException('Only confirmed bookings can be consumed');
        }
        booking.status = enums_1.BookingStatus.CONSUMED;
        await this.bookingsRepository.save(booking);
        return this.toResponseDto(booking);
    }
    async getAvailability(terminalId, date) {
        const terminal = await this.terminalsRepository.findOne({
            where: { id: terminalId },
            relations: ['port'],
        });
        if (!terminal) {
            throw new common_1.NotFoundException('Terminal not found');
        }
        const slotDuration = terminal.port.slotDuration;
        const startOfDay = new Date(date);
        startOfDay.setHours(6, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(22, 0, 0, 0);
        const bookings = await this.bookingsRepository.find({
            where: {
                terminalId,
                status: (0, typeorm_1.In)([enums_1.BookingStatus.PENDING, enums_1.BookingStatus.CONFIRMED]),
                slotStart: (0, typeorm_1.Between)(startOfDay, endOfDay),
            },
        });
        const slots = [];
        const currentSlot = new Date(startOfDay);
        while (currentSlot < endOfDay) {
            const slotStart = new Date(currentSlot);
            const slotEnd = new Date(currentSlot);
            slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);
            const bookedCount = bookings.filter((b) => b.slotStart < slotEnd && b.slotEnd > slotStart).length;
            slots.push({
                slotStart,
                slotEnd,
                bookedCount,
                availableCount: terminal.maxCapacity - bookedCount,
                isAvailable: bookedCount < terminal.maxCapacity,
            });
            currentSlot.setMinutes(currentSlot.getMinutes() + slotDuration);
        }
        return { slots, maxCapacity: terminal.maxCapacity };
    }
    generateBookingReference() {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `BK-${timestamp}-${random}`;
    }
    toResponseDto(booking) {
        return {
            id: booking.id,
            bookingReference: booking.bookingReference,
            portId: booking.portId,
            terminalId: booking.terminalId,
            carrierId: booking.carrierId,
            truckId: booking.truckId,
            driverId: booking.driverId,
            status: booking.status,
            slotStart: booking.slotStart,
            slotEnd: booking.slotEnd,
            slotsCount: booking.slotsCount,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
        };
    }
    toDetailedResponseDto(booking) {
        return {
            ...this.toResponseDto(booking),
            truck: booking.truck
                ? { id: booking.truck.id, plateNumber: booking.truck.plateNumber }
                : undefined,
            driver: booking.driver
                ? {
                    id: booking.driver.id,
                    user: booking.driver.user
                        ? { fullName: booking.driver.user.fullName }
                        : undefined,
                }
                : undefined,
            terminal: booking.terminal
                ? { id: booking.terminal.id, name: booking.terminal.name }
                : undefined,
        };
    }
}
exports.BookingsService = BookingsService;
