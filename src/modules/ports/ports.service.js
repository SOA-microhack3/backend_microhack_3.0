"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortsService = void 0;
const common_1 = require("@nestjs/common");
@(0, common_1.Injectable)()
class PortsService {
    portsRepository;
    constructor(
    @(0, typeorm_1.InjectRepository)(port_entity_1.Port)
    portsRepository) {
        this.portsRepository = portsRepository;
    }
    async findAll() {
        const ports = await this.portsRepository.find({
            order: { name: 'ASC' },
        });
        return ports.map(this.toResponseDto);
    }
    async findOne(id) {
        const port = await this.portsRepository.findOne({ where: { id } });
        if (!port) {
            throw new common_1.NotFoundException('Port not found');
        }
        return this.toResponseDto(port);
    }
    async findOneEntity(id) {
        const port = await this.portsRepository.findOne({ where: { id } });
        if (!port) {
            throw new common_1.NotFoundException('Port not found');
        }
        return port;
    }
    async create(createPortDto) {
        const port = this.portsRepository.create({
            name: createPortDto.name,
            countryCode: createPortDto.countryCode,
            timezone: createPortDto.timezone || 'UTC',
            slotDuration: createPortDto.slotDuration || 60,
        });
        await this.portsRepository.save(port);
        return this.toResponseDto(port);
    }
    async update(id, updatePortDto) {
        const port = await this.portsRepository.findOne({ where: { id } });
        if (!port) {
            throw new common_1.NotFoundException('Port not found');
        }
        Object.assign(port, updatePortDto);
        await this.portsRepository.save(port);
        return this.toResponseDto(port);
    }
    async remove(id) {
        const port = await this.portsRepository.findOne({ where: { id } });
        if (!port) {
            throw new common_1.NotFoundException('Port not found');
        }
        await this.portsRepository.remove(port);
    }
    async getTerminals(id) {
        const port = await this.portsRepository.findOne({
            where: { id },
            relations: ['terminals'],
        });
        if (!port) {
            throw new common_1.NotFoundException('Port not found');
        }
        return port.terminals;
    }
    toResponseDto(port) {
        return {
            id: port.id,
            name: port.name,
            countryCode: port.countryCode,
            timezone: port.timezone,
            slotDuration: port.slotDuration,
            createdAt: port.createdAt,
        };
    }
}
exports.PortsService = PortsService;
