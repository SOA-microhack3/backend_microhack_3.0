"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrucksService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const enums_1 = require("../../common/enums");
@(0, common_1.Injectable)()
class TrucksService {
    trucksRepository;
    bookingsRepository;
    constructor(
    @(0, typeorm_2.InjectRepository)(truck_entity_1.Truck)
    trucksRepository, 
    @(0, typeorm_2.InjectRepository)(booking_entity_1.Booking)
    bookingsRepository) {
        this.trucksRepository = trucksRepository;
        this.bookingsRepository = bookingsRepository;
    }
    async findAll(carrierId) {
        const where = carrierId ? { carrierId } : {};
        const trucks = await this.trucksRepository.find({
            where,
            order: { plateNumber: 'ASC' },
        });
        return trucks.map(this.toResponseDto);
    }
    async findOne(id) {
        const truck = await this.trucksRepository.findOne({ where: { id } });
        if (!truck) {
            throw new common_1.NotFoundException('Truck not found');
        }
        return this.toResponseDto(truck);
    }
    async findOneEntity(id) {
        const truck = await this.trucksRepository.findOne({ where: { id } });
        if (!truck) {
            throw new common_1.NotFoundException('Truck not found');
        }
        return truck;
    }
    async create(createTruckDto) {
        const existingTruck = await this.trucksRepository.findOne({
            where: { plateNumber: createTruckDto.plateNumber },
        });
        if (existingTruck) {
            throw new common_1.ConflictException('Plate number already registered');
        }
        const truck = this.trucksRepository.create(createTruckDto);
        await this.trucksRepository.save(truck);
        return this.toResponseDto(truck);
    }
    async update(id, updateTruckDto) {
        const truck = await this.trucksRepository.findOne({ where: { id } });
        if (!truck) {
            throw new common_1.NotFoundException('Truck not found');
        }
        if (updateTruckDto.plateNumber) {
            const existingTruck = await this.trucksRepository.findOne({
                where: { plateNumber: updateTruckDto.plateNumber, id: (0, typeorm_1.Not)(id) },
            });
            if (existingTruck) {
                throw new common_1.ConflictException('Plate number already registered');
            }
        }
        Object.assign(truck, updateTruckDto);
        await this.trucksRepository.save(truck);
        return this.toResponseDto(truck);
    }
    async updateStatus(id, updateTruckStatusDto) {
        const truck = await this.trucksRepository.findOne({ where: { id } });
        if (!truck) {
            throw new common_1.NotFoundException('Truck not found');
        }
        truck.status = updateTruckStatusDto.status;
        await this.trucksRepository.save(truck);
        return this.toResponseDto(truck);
    }
    async getAvailability(id, date) {
        const truck = await this.trucksRepository.findOne({ where: { id } });
        if (!truck) {
            throw new common_1.NotFoundException('Truck not found');
        }
        const startOfDay = new Date(date);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(date);
        endOfDay.setHours(23, 59, 59, 999);
        const bookings = await this.bookingsRepository.find({
            where: {
                truckId: id,
                status: (0, typeorm_1.In)([enums_1.BookingStatus.PENDING, enums_1.BookingStatus.CONFIRMED]),
            },
        });
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
    toResponseDto(truck) {
        return {
            id: truck.id,
            plateNumber: truck.plateNumber,
            carrierId: truck.carrierId,
            status: truck.status,
            createdAt: truck.createdAt,
        };
    }
}
exports.TrucksService = TrucksService;
