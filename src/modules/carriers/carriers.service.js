"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CarriersService = void 0;
const common_1 = require("@nestjs/common");
@(0, common_1.Injectable)()
class CarriersService {
    carriersRepository;
    constructor(
    @(0, typeorm_1.InjectRepository)(carrier_entity_1.Carrier)
    carriersRepository) {
        this.carriersRepository = carriersRepository;
    }
    async findAll() {
        const carriers = await this.carriersRepository.find({
            order: { name: 'ASC' },
        });
        return carriers.map(this.toResponseDto);
    }
    async findOne(id) {
        const carrier = await this.carriersRepository.findOne({ where: { id } });
        if (!carrier) {
            throw new common_1.NotFoundException('Carrier not found');
        }
        return this.toResponseDto(carrier);
    }
    async findByUserId(userId) {
        return this.carriersRepository.findOne({ where: { userId } });
    }
    async findByUserIdDto(userId) {
        const carrier = await this.carriersRepository.findOne({ where: { userId } });
        if (!carrier) {
            throw new common_1.NotFoundException('Carrier not found');
        }
        return this.toResponseDto(carrier);
    }
    async findOneEntity(id) {
        const carrier = await this.carriersRepository.findOne({ where: { id } });
        if (!carrier) {
            throw new common_1.NotFoundException('Carrier not found');
        }
        return carrier;
    }
    async create(createCarrierDto) {
        const carrier = this.carriersRepository.create(createCarrierDto);
        await this.carriersRepository.save(carrier);
        return this.toResponseDto(carrier);
    }
    async update(id, updateCarrierDto) {
        const carrier = await this.carriersRepository.findOne({ where: { id } });
        if (!carrier) {
            throw new common_1.NotFoundException('Carrier not found');
        }
        Object.assign(carrier, updateCarrierDto);
        await this.carriersRepository.save(carrier);
        return this.toResponseDto(carrier);
    }
    async getTrucks(id) {
        const carrier = await this.carriersRepository.findOne({
            where: { id },
            relations: ['trucks'],
        });
        if (!carrier) {
            throw new common_1.NotFoundException('Carrier not found');
        }
        return carrier.trucks;
    }
    async getDrivers(id) {
        const carrier = await this.carriersRepository.findOne({
            where: { id },
            relations: ['drivers', 'drivers.user'],
        });
        if (!carrier) {
            throw new common_1.NotFoundException('Carrier not found');
        }
        return carrier.drivers;
    }
    toResponseDto(carrier) {
        return {
            id: carrier.id,
            name: carrier.name,
            userId: carrier.userId,
            createdAt: carrier.createdAt,
        };
    }
}
exports.CarriersService = CarriersService;
