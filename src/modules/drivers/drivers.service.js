"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DriversService = void 0;
const common_1 = require("@nestjs/common");
@(0, common_1.Injectable)()
class DriversService {
    driversRepository;
    constructor(
    @(0, typeorm_1.InjectRepository)(driver_entity_1.Driver)
    driversRepository) {
        this.driversRepository = driversRepository;
    }
    async findAll(carrierId) {
        const where = carrierId ? { carrierId } : {};
        const drivers = await this.driversRepository.find({
            where,
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
        return drivers.map(this.toResponseDto);
    }
    async findOne(id) {
        const driver = await this.driversRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        return this.toResponseDto(driver);
    }
    async findOneEntity(id) {
        const driver = await this.driversRepository.findOne({ where: { id } });
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        return driver;
    }
    async findByUserId(userId) {
        return this.driversRepository.findOne({ where: { userId } });
    }
    async findByUserIdDto(userId) {
        const driver = await this.driversRepository.findOne({
            where: { userId },
            relations: ['user'],
        });
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        return this.toResponseDto(driver);
    }
    async create(createDriverDto) {
        const driver = this.driversRepository.create(createDriverDto);
        await this.driversRepository.save(driver);
        const savedDriver = await this.driversRepository.findOne({
            where: { id: driver.id },
            relations: ['user'],
        });
        return this.toResponseDto(savedDriver);
    }
    async updateStatus(id, updateDriverStatusDto) {
        const driver = await this.driversRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!driver) {
            throw new common_1.NotFoundException('Driver not found');
        }
        driver.status = updateDriverStatusDto.status;
        await this.driversRepository.save(driver);
        return this.toResponseDto(driver);
    }
    toResponseDto(driver) {
        return {
            id: driver.id,
            userId: driver.userId,
            carrierId: driver.carrierId,
            status: driver.status,
            createdAt: driver.createdAt,
            user: driver.user
                ? {
                    id: driver.user.id,
                    fullName: driver.user.fullName,
                    email: driver.user.email,
                }
                : undefined,
        };
    }
}
exports.DriversService = DriversService;
