import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Carrier } from './entities/carrier.entity';
import { CreateCarrierDto, UpdateCarrierDto, CarrierResponseDto } from './dto';

@Injectable()
export class CarriersService {
    constructor(
        @InjectRepository(Carrier)
        private carriersRepository: Repository<Carrier>,
    ) { }

    async findAll(): Promise<CarrierResponseDto[]> {
        const carriers = await this.carriersRepository.find({
            order: { name: 'ASC' },
        });
        return carriers.map(this.toResponseDto);
    }

    async findOne(id: string): Promise<CarrierResponseDto> {
        const carrier = await this.carriersRepository.findOne({ where: { id } });
        if (!carrier) {
            throw new NotFoundException('Carrier not found');
        }
        return this.toResponseDto(carrier);
    }

    async findByUserId(userId: string): Promise<Carrier | null> {
        return this.carriersRepository.findOne({ where: { userId } });
    }

    async findByUserIdDto(userId: string): Promise<CarrierResponseDto> {
        const carrier = await this.carriersRepository.findOne({ where: { userId } });
        if (!carrier) {
            throw new NotFoundException('Carrier not found');
        }
        return this.toResponseDto(carrier);
    }

    async findOneEntity(id: string): Promise<Carrier> {
        const carrier = await this.carriersRepository.findOne({ where: { id } });
        if (!carrier) {
            throw new NotFoundException('Carrier not found');
        }
        return carrier;
    }

    async create(createCarrierDto: CreateCarrierDto): Promise<CarrierResponseDto> {
        const carrier = this.carriersRepository.create(createCarrierDto);
        await this.carriersRepository.save(carrier);
        return this.toResponseDto(carrier);
    }

    async update(id: string, updateCarrierDto: UpdateCarrierDto): Promise<CarrierResponseDto> {
        const carrier = await this.carriersRepository.findOne({ where: { id } });
        if (!carrier) {
            throw new NotFoundException('Carrier not found');
        }

        Object.assign(carrier, updateCarrierDto);
        await this.carriersRepository.save(carrier);
        return this.toResponseDto(carrier);
    }

    async getTrucks(id: string): Promise<any[]> {
        const carrier = await this.carriersRepository.findOne({
            where: { id },
            relations: ['trucks'],
        });
        if (!carrier) {
            throw new NotFoundException('Carrier not found');
        }
        return carrier.trucks;
    }

    async getDrivers(id: string): Promise<any[]> {
        const carrier = await this.carriersRepository.findOne({
            where: { id },
            relations: ['drivers', 'drivers.user'],
        });
        if (!carrier) {
            throw new NotFoundException('Carrier not found');
        }
        return carrier.drivers;
    }

    private toResponseDto(carrier: Carrier): CarrierResponseDto {
        return {
            id: carrier.id,
            name: carrier.name,
            userId: carrier.userId,
            createdAt: carrier.createdAt,
        };
    }
}
