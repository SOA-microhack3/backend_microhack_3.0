import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, In } from 'typeorm';
import { Truck } from './entities/truck.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { CreateTruckDto, UpdateTruckDto, UpdateTruckStatusDto, TruckResponseDto } from './dto';
import { TruckStatus, BookingStatus } from '../../common/enums';

@Injectable()
export class TrucksService {
    constructor(
        @InjectRepository(Truck)
        private trucksRepository: Repository<Truck>,
        @InjectRepository(Booking)
        private bookingsRepository: Repository<Booking>,
    ) { }

    async findAll(carrierId?: string): Promise<TruckResponseDto[]> {
        const where = carrierId ? { carrierId } : {};
        const trucks = await this.trucksRepository.find({
            where,
            order: { plateNumber: 'ASC' },
        });
        return trucks.map(this.toResponseDto);
    }

    async findOne(id: string): Promise<TruckResponseDto> {
        const truck = await this.trucksRepository.findOne({ where: { id } });
        if (!truck) {
            throw new NotFoundException('Truck not found');
        }
        return this.toResponseDto(truck);
    }

    async findOneEntity(id: string): Promise<Truck> {
        const truck = await this.trucksRepository.findOne({ where: { id } });
        if (!truck) {
            throw new NotFoundException('Truck not found');
        }
        return truck;
    }

    async create(createTruckDto: CreateTruckDto): Promise<TruckResponseDto> {
        const existingTruck = await this.trucksRepository.findOne({
            where: { plateNumber: createTruckDto.plateNumber },
        });
        if (existingTruck) {
            throw new ConflictException('Plate number already registered');
        }

        const truck = this.trucksRepository.create(createTruckDto);
        await this.trucksRepository.save(truck);
        return this.toResponseDto(truck);
    }

    async update(id: string, updateTruckDto: UpdateTruckDto): Promise<TruckResponseDto> {
        const truck = await this.trucksRepository.findOne({ where: { id } });
        if (!truck) {
            throw new NotFoundException('Truck not found');
        }

        if (updateTruckDto.plateNumber) {
            const existingTruck = await this.trucksRepository.findOne({
                where: { plateNumber: updateTruckDto.plateNumber, id: Not(id) },
            });
            if (existingTruck) {
                throw new ConflictException('Plate number already registered');
            }
        }

        Object.assign(truck, updateTruckDto);
        await this.trucksRepository.save(truck);
        return this.toResponseDto(truck);
    }

    async updateStatus(id: string, updateTruckStatusDto: UpdateTruckStatusDto): Promise<TruckResponseDto> {
        const truck = await this.trucksRepository.findOne({ where: { id } });
        if (!truck) {
            throw new NotFoundException('Truck not found');
        }

        truck.status = updateTruckStatusDto.status;
        await this.trucksRepository.save(truck);
        return this.toResponseDto(truck);
    }

    async getAvailability(id: string, date: Date): Promise<any> {
        const truck = await this.trucksRepository.findOne({ where: { id } });
        if (!truck) {
            throw new NotFoundException('Truck not found');
        }

        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);

        const bookings = await this.bookingsRepository.find({
            where: {
                truckId: id,
                status: In([BookingStatus.PENDING, BookingStatus.CONFIRMED]),
            },
        });

        // Filter bookings for the specified date
        const dayBookings = bookings.filter((b) => {
            return b.slotStart >= startOfDay && b.slotStart <= endOfDay;
        });

        return {
            truckId: id,
            plateNumber: truck.plateNumber,
            date: date.toISOString().split('T')[0],
            bookedSlots: dayBookings.map((b) => ({
                slotStart: b.slotStart,
                slotEnd: b.slotEnd,
                status: b.status,
            })),
        };
    }

    private toResponseDto(truck: Truck): TruckResponseDto {
        return {
            id: truck.id,
            plateNumber: truck.plateNumber,
            carrierId: truck.carrierId,
            status: truck.status,
            createdAt: truck.createdAt,
        };
    }
}
