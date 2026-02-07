import {
    Injectable,
    NotFoundException,
    BadRequestException,
    ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Between, In, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Booking } from './entities/booking.entity';
import { Terminal } from '../terminals/entities/terminal.entity';
import { Port } from '../ports/entities/port.entity';
import { Truck } from '../trucks/entities/truck.entity';
import { Driver } from '../drivers/entities/driver.entity';
import { Carrier } from '../carriers/entities/carrier.entity';
import { Operator } from '../operators/entities/operator.entity';
import { NotificationsService } from '../notifications/notifications.service';
import {
    CreateBookingDto,
    UpdateBookingDto,
    BookingResponseDto,
    BookingWithDetailsDto,
} from './dto';
import { BookingStatus, TruckStatus, DriverStatus, UserRole, NotificationType, NotificationSource } from '../../common/enums';

@Injectable()
export class BookingsService {
    constructor(
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
        @InjectRepository(Terminal)
        private terminalsRepository: Repository<Terminal>,
        @InjectRepository(Truck)
        private trucksRepository: Repository<Truck>,
        @InjectRepository(Driver)
        private driversRepository: Repository<Driver>,
        @InjectRepository(Carrier)
        private carriersRepository: Repository<Carrier>,
        @InjectRepository(Operator)
        private operatorsRepository: Repository<Operator>,
        private notificationsService: NotificationsService,
        private dataSource: DataSource,
    ) { }

    async findAll(
        userId: string,
        userRole: UserRole,
        carrierId?: string,
        terminalId?: string,
        status?: BookingStatus,
    ): Promise<BookingWithDetailsDto[]> {
        const queryBuilder = this.bookingsRepository
            .createQueryBuilder('booking')
            .leftJoinAndSelect('booking.truck', 'truck')
            .leftJoinAndSelect('booking.driver', 'driver')
            .leftJoinAndSelect('driver.user', 'driverUser')
            .leftJoinAndSelect('booking.terminal', 'terminal')
            .orderBy('booking.slotStart', 'ASC');

        // Role-based filtering
        if (userRole === UserRole.CARRIER) {
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
        } else if (userRole === UserRole.OPERATOR) {
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
        } else if (userRole === UserRole.DRIVER) {
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

    async findOne(id: string): Promise<BookingWithDetailsDto> {
        const booking = await this.bookingsRepository.findOne({
            where: { id },
            relations: ['truck', 'driver', 'driver.user', 'terminal'],
        });
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }
        return this.toDetailedResponseDto(booking);
    }

    async findByReference(reference: string): Promise<BookingWithDetailsDto> {
        const booking = await this.bookingsRepository.findOne({
            where: { bookingReference: reference },
            relations: ['truck', 'driver', 'driver.user', 'terminal'],
        });
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }
        return this.toDetailedResponseDto(booking);
    }

    async create(
        createBookingDto: CreateBookingDto,
        carrierId: string | undefined,
        userId: string,
    ): Promise<BookingResponseDto> {
        let resolvedCarrierId = carrierId;
        if (!resolvedCarrierId) {
            const carrier = await this.carriersRepository.findOne({
                where: { userId },
            });
            resolvedCarrierId = carrier?.id;
        }
        if (!resolvedCarrierId) {
            throw new BadRequestException('Carrier not found for user');
        }
        // Use a transaction with pessimistic locking to prevent race conditions
        return this.dataSource.transaction(async (manager) => {
            // Validate terminal exists and get port info
            const terminal = await manager.findOne(Terminal, {
                where: { id: createBookingDto.terminalId },
                lock: { mode: 'pessimistic_read' },
            });
            if (!terminal) {
                throw new NotFoundException('Terminal not found');
            }
            const port = await manager.findOne(Port, {
                where: { id: terminal.portId },
            });
            if (!port) {
                throw new NotFoundException('Port not found for terminal');
            }

            // Validate truck
            const truck = await manager.findOne(Truck, {
                where: { id: createBookingDto.truckId },
            });
            if (!truck) {
                throw new NotFoundException('Truck not found');
            }
            if (truck.carrierId !== resolvedCarrierId) {
                throw new BadRequestException('Truck does not belong to your carrier');
            }
            if (truck.status !== TruckStatus.ACTIVE) {
                throw new BadRequestException('Truck is not active');
            }

            // Validate driver
            const driver = await manager.findOne(Driver, {
                where: { id: createBookingDto.driverId },
            });
            if (!driver) {
                throw new NotFoundException('Driver not found');
            }
            if (driver.carrierId !== resolvedCarrierId) {
                throw new BadRequestException('Driver does not belong to your carrier');
            }
            if (driver.status !== DriverStatus.ACTIVE) {
                throw new BadRequestException('Driver is not active');
            }

            // Calculate slot times
            const slotDuration = port.slotDuration;
            const slotsCount = createBookingDto.slotsCount || 1;
            const slotStart = new Date(createBookingDto.slotStart);
            const slotEnd = new Date(slotStart);
            slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration * slotsCount);

            // Check capacity with pessimistic locking
            const existingBookings = await manager
                .createQueryBuilder(Booking, 'booking')
                .setLock('pessimistic_write')
                .where('booking.terminalId = :terminalId', {
                    terminalId: createBookingDto.terminalId,
                })
                .andWhere('booking.status IN (:...statuses)', {
                    statuses: [BookingStatus.PENDING, BookingStatus.CONFIRMED],
                })
                .andWhere(
                    '(booking.slotStart < :slotEnd AND booking.slotEnd > :slotStart)',
                    { slotStart, slotEnd },
                )
                .getMany();

            if (existingBookings.length >= terminal.maxCapacity) {
                throw new ConflictException(
                    'No capacity available for the selected time slot',
                );
            }

            // Check if truck is already booked for this time
            const truckBooking = await manager.findOne(Booking, {
                where: {
                    truckId: createBookingDto.truckId,
                    status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
                },
            });
            if (truckBooking) {
                const overlap =
                    truckBooking.slotStart < slotEnd && truckBooking.slotEnd > slotStart;
                if (overlap) {
                    throw new ConflictException('Truck is already booked for this time');
                }
            }

            // Generate unique booking reference
            const bookingReference = this.generateBookingReference();

            // Create booking
            const booking = manager.create(Booking, {
                portId: terminal.portId,
                terminalId: createBookingDto.terminalId,
                carrierId: resolvedCarrierId,
                truckId: createBookingDto.truckId,
                driverId: createBookingDto.driverId,
                status: BookingStatus.CONFIRMED,
                slotStart,
                slotEnd,
                slotsCount,
                bookingReference,
                containerMatricule: createBookingDto.containerMatricule,
            });

            await manager.save(booking);
            try {
                const driver = await manager.findOne(Driver, {
                    where: { id: booking.driverId },
                });
                if (driver?.userId) {
                    await this.notificationsService.create({
                        userId: driver.userId,
                        type: NotificationType.PUSH,
                        source: NotificationSource.SYSTEM,
                        message: `Booking ${booking.bookingReference} confirmed. Your QR code is available.`,
                    });
                }
            } catch {
                // ignore notification errors
            }
            return this.toResponseDto(booking);
        });
    }

    async update(
        id: string,
        updateBookingDto: UpdateBookingDto,
        carrierId: string | undefined,
        userId: string,
    ): Promise<BookingResponseDto> {
        let resolvedCarrierId = carrierId;
        if (!resolvedCarrierId) {
            const carrier = await this.carriersRepository.findOne({
                where: { userId },
            });
            resolvedCarrierId = carrier?.id;
        }
        if (!resolvedCarrierId) {
            throw new BadRequestException('Carrier not found for user');
        }
        const booking = await this.bookingsRepository.findOne({
            where: { id },
            relations: ['terminal', 'terminal.port'],
        });
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }
        if (booking.carrierId !== resolvedCarrierId) {
            throw new BadRequestException('Booking does not belong to your carrier');
        }
        if (booking.status !== BookingStatus.PENDING) {
            throw new BadRequestException('Only pending bookings can be modified');
        }

        if (updateBookingDto.truckId) {
            const truck = await this.trucksRepository.findOne({
                where: { id: updateBookingDto.truckId },
            });
            if (!truck || truck.carrierId !== resolvedCarrierId) {
                throw new BadRequestException('Invalid truck');
            }
            booking.truckId = updateBookingDto.truckId;
        }

        if (updateBookingDto.driverId) {
            const driver = await this.driversRepository.findOne({
                where: { id: updateBookingDto.driverId },
            });
            if (!driver || driver.carrierId !== resolvedCarrierId) {
                throw new BadRequestException('Invalid driver');
            }
            booking.driverId = updateBookingDto.driverId;
        }

        if (updateBookingDto.slotStart) {
            const slotDuration = booking.terminal.port.slotDuration;
            booking.slotStart = new Date(updateBookingDto.slotStart);
            booking.slotEnd = new Date(booking.slotStart);
            booking.slotEnd.setMinutes(
                booking.slotEnd.getMinutes() + slotDuration * booking.slotsCount,
            );
        }

        await this.bookingsRepository.save(booking);
        return this.toResponseDto(booking);
    }

    async cancel(id: string, userId: string, userRole: UserRole): Promise<BookingResponseDto> {
        const booking = await this.bookingsRepository.findOne({ where: { id } });
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (![BookingStatus.PENDING, BookingStatus.CONFIRMED].includes(booking.status)) {
            throw new BadRequestException('Booking cannot be cancelled');
        }

        booking.status = BookingStatus.CANCELLED;
        await this.bookingsRepository.save(booking);
        return this.toResponseDto(booking);
    }

    async confirm(id: string): Promise<BookingResponseDto> {
        const booking = await this.bookingsRepository.findOne({ where: { id } });
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.status !== BookingStatus.PENDING) {
            throw new BadRequestException('Only pending bookings can be confirmed');
        }

        booking.status = BookingStatus.CONFIRMED;
        await this.bookingsRepository.save(booking);

        try {
            const driver = await this.driversRepository.findOne({
                where: { id: booking.driverId },
            });
            if (driver?.userId) {
                await this.notificationsService.create({
                    userId: driver.userId,
                    type: NotificationType.PUSH,
                    source: NotificationSource.SYSTEM,
                    message: `Booking ${booking.bookingReference} confirmed. Your QR code is available.`,
                });
            }
        } catch {
            // ignore notification errors
        }

        return this.toResponseDto(booking);
    }

    async reject(id: string): Promise<BookingResponseDto> {
        const booking = await this.bookingsRepository.findOne({ where: { id } });
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.status !== BookingStatus.PENDING) {
            throw new BadRequestException('Only pending bookings can be rejected');
        }

        booking.status = BookingStatus.REJECTED;
        await this.bookingsRepository.save(booking);
        return this.toResponseDto(booking);
    }

    async markConsumed(id: string): Promise<BookingResponseDto> {
        const booking = await this.bookingsRepository.findOne({ where: { id } });
        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        if (booking.status !== BookingStatus.CONFIRMED) {
            throw new BadRequestException('Only confirmed bookings can be consumed');
        }

        booking.status = BookingStatus.CONSUMED;
        await this.bookingsRepository.save(booking);
        return this.toResponseDto(booking);
    }

    async getAvailability(
        terminalId: string,
        date: Date,
    ): Promise<{ slots: any[]; maxCapacity: number }> {
        const terminal = await this.terminalsRepository.findOne({
            where: { id: terminalId },
            relations: ['port'],
        });
        if (!terminal) {
            throw new NotFoundException('Terminal not found');
        }

        const slotDuration = terminal.port.slotDuration;
        const startOfDay = new Date(date);
        startOfDay.setHours(6, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(22, 0, 0, 0);

        const bookings = await this.bookingsRepository.find({
            where: {
                terminalId,
                status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
                slotStart: Between(startOfDay, endOfDay),
            },
        });

        const slots: any[] = [];
        const currentSlot = new Date(startOfDay);

        while (currentSlot < endOfDay) {
            const slotStart = new Date(currentSlot);
            const slotEnd = new Date(currentSlot);
            slotEnd.setMinutes(slotEnd.getMinutes() + slotDuration);

            const bookedCount = bookings.filter(
                (b) => b.slotStart < slotEnd && b.slotEnd > slotStart,
            ).length;

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

    private generateBookingReference(): string {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 6).toUpperCase();
        return `BK-${timestamp}-${random}`;
    }

    private toResponseDto(booking: Booking): BookingResponseDto {
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
            containerMatricule: booking.containerMatricule,
            createdAt: booking.createdAt,
            updatedAt: booking.updatedAt,
        };
    }

    private toDetailedResponseDto(booking: Booking): BookingWithDetailsDto {
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

    async bulkConfirm(
        bookingIds: string[],
        userId: string,
    ): Promise<{ confirmed: number; failed: string[] }> {
        const failed: string[] = [];
        let confirmed = 0;

        for (const id of bookingIds) {
            try {
                await this.confirm(id);
                confirmed++;
            } catch (error) {
                failed.push(id);
            }
        }

        return { confirmed, failed };
    }

    async bulkReject(
        bookingIds: string[],
        reason: string | undefined,
        userId: string,
    ): Promise<{ rejected: number; failed: string[] }> {
        const failed: string[] = [];
        let rejected = 0;

        for (const id of bookingIds) {
            try {
                await this.reject(id);
                rejected++;
            } catch (error) {
                failed.push(id);
            }
        }

        return { rejected, failed };
    }

    // Slot Reassignment - Move booking to a different time slot
    async reassignSlot(
        bookingId: string,
        newSlotStart: Date,
        operatorId: string,
    ): Promise<BookingResponseDto> {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId },
            relations: ['terminal', 'terminal.port'],
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Calculate new slot end based on port's slot duration
        const slotDuration = booking.terminal?.port?.slotDuration || 30;
        const newSlotEnd = new Date(newSlotStart);
        newSlotEnd.setMinutes(newSlotEnd.getMinutes() + slotDuration);

        // Check capacity for the new slot
        const existingBookings = await this.bookingsRepository.count({
            where: {
                terminalId: booking.terminalId,
                slotStart: newSlotStart,
                status: In([BookingStatus.CONFIRMED, BookingStatus.PENDING]),
            },
        });

        const terminal = await this.terminalsRepository.findOne({
            where: { id: booking.terminalId },
        });

        if (existingBookings >= (terminal?.maxCapacity || 10)) {
            throw new ConflictException('New slot is at full capacity');
        }

        // Update booking with new slot
        booking.slotStart = newSlotStart;
        booking.slotEnd = newSlotEnd;
        await this.bookingsRepository.save(booking);

        // Notify the carrier/driver about the slot change
        try {
            const driver = await this.driversRepository.findOne({
                where: { id: booking.driverId },
            });
            if (driver?.userId) {
                await this.notificationsService.create({
                    userId: driver.userId,
                    type: NotificationType.PUSH,
                    source: NotificationSource.SYSTEM,
                    message: `Créneau modifié: ${new Date(newSlotStart).toLocaleString('fr-FR')}`,
                });
            }
        } catch {
            // ignore notification errors
        }

        return this.toResponseDto(booking);
    }

    // Modify Booking Details - For operators to change truck, driver, or terminal
    async modifyBookingDetails(
        bookingId: string,
        modifications: {
            truckId?: string;
            driverId?: string;
            terminalId?: string;
            slotStart?: Date;
        },
        operatorId: string,
    ): Promise<BookingResponseDto> {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId },
            relations: ['terminal', 'terminal.port'],
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // Validate new truck if provided
        if (modifications.truckId) {
            const truck = await this.trucksRepository.findOne({
                where: { id: modifications.truckId },
            });
            if (!truck) {
                throw new NotFoundException('Truck not found');
            }
            booking.truckId = modifications.truckId;
        }

        // Validate new driver if provided
        if (modifications.driverId) {
            const driver = await this.driversRepository.findOne({
                where: { id: modifications.driverId },
            });
            if (!driver) {
                throw new NotFoundException('Driver not found');
            }
            booking.driverId = modifications.driverId;
        }

        // Validate new terminal if provided
        if (modifications.terminalId) {
            const terminal = await this.terminalsRepository.findOne({
                where: { id: modifications.terminalId },
            });
            if (!terminal) {
                throw new NotFoundException('Terminal not found');
            }
            booking.terminalId = modifications.terminalId;
        }

        // Update slot start if provided
        if (modifications.slotStart) {
            const slotDuration = booking.terminal?.port?.slotDuration || 30;
            booking.slotStart = modifications.slotStart;
            booking.slotEnd = new Date(modifications.slotStart);
            booking.slotEnd.setMinutes(booking.slotEnd.getMinutes() + slotDuration);
        }

        await this.bookingsRepository.save(booking);

        // Notify driver about modifications
        try {
            const driver = await this.driversRepository.findOne({
                where: { id: booking.driverId },
            });
            if (driver?.userId) {
                await this.notificationsService.create({
                    userId: driver.userId,
                    type: NotificationType.PUSH,
                    source: NotificationSource.SYSTEM,
                    message: `Réservation ${booking.bookingReference} modifiée par l'opérateur`,
                });
            }
        } catch {
            // ignore notification errors
        }

        return this.toResponseDto(booking);
    }

    // Manual Override - Approve exception with justification
    async manualOverride(
        bookingId: string,
        reason: string,
        operatorId: string,
    ): Promise<BookingResponseDto> {
        const booking = await this.bookingsRepository.findOne({
            where: { id: bookingId },
        });

        if (!booking) {
            throw new NotFoundException('Booking not found');
        }

        // For now, just confirm the booking
        // In a full implementation, we would log the override reason
        booking.status = BookingStatus.CONFIRMED;
        await this.bookingsRepository.save(booking);

        // Notify driver
        try {
            const driver = await this.driversRepository.findOne({
                where: { id: booking.driverId },
            });
            if (driver?.userId) {
                await this.notificationsService.create({
                    userId: driver.userId,
                    type: NotificationType.PUSH,
                    source: NotificationSource.SYSTEM,
                    message: `Réservation ${booking.bookingReference} approuvée (exception)`,
                });
            }
        } catch {
            // ignore notification errors
        }

        return this.toResponseDto(booking);
    }
}

