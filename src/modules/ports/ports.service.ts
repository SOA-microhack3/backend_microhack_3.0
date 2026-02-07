import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Port } from './entities/port.entity';
import { CreatePortDto, UpdatePortDto, PortResponseDto } from './dto';

@Injectable()
export class PortsService {
    constructor(
        @InjectRepository(Port)
        private portsRepository: Repository<Port>,
    ) { }

    async findAll(): Promise<PortResponseDto[]> {
        const ports = await this.portsRepository.find({
            order: { name: 'ASC' },
        });
        return ports.map(this.toResponseDto);
    }

    async findOne(id: string): Promise<PortResponseDto> {
        const port = await this.portsRepository.findOne({ where: { id } });
        if (!port) {
            throw new NotFoundException('Port not found');
        }
        return this.toResponseDto(port);
    }

    async findOneEntity(id: string): Promise<Port> {
        const port = await this.portsRepository.findOne({ where: { id } });
        if (!port) {
            throw new NotFoundException('Port not found');
        }
        return port;
    }

    async create(createPortDto: CreatePortDto): Promise<PortResponseDto> {
        const port = this.portsRepository.create({
            name: createPortDto.name,
            countryCode: createPortDto.countryCode,
            timezone: createPortDto.timezone || 'UTC',
            slotDuration: createPortDto.slotDuration || 60,
        });

        await this.portsRepository.save(port);
        return this.toResponseDto(port);
    }

    async update(id: string, updatePortDto: UpdatePortDto): Promise<PortResponseDto> {
        const port = await this.portsRepository.findOne({ where: { id } });
        if (!port) {
            throw new NotFoundException('Port not found');
        }

        Object.assign(port, updatePortDto);
        await this.portsRepository.save(port);
        return this.toResponseDto(port);
    }

    async remove(id: string): Promise<void> {
        const port = await this.portsRepository.findOne({ where: { id } });
        if (!port) {
            throw new NotFoundException('Port not found');
        }
        await this.portsRepository.remove(port);
    }

    async getTerminals(id: string): Promise<any[]> {
        const port = await this.portsRepository.findOne({
            where: { id },
            relations: ['terminals'],
        });
        if (!port) {
            throw new NotFoundException('Port not found');
        }
        return port.terminals;
    }

    private toResponseDto(port: Port): PortResponseDto {
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
