import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Driver } from './entities/driver.entity';
import { CreateDriverDto, UpdateDriverStatusDto, DriverResponseDto } from './dto';

@Injectable()
export class DriversService {
    constructor(
        @InjectRepository(Driver)
        private driversRepository: Repository<Driver>,
    ) { }

    async findAll(carrierId?: string): Promise<DriverResponseDto[]> {
        const where = carrierId ? { carrierId } : {};
        const drivers = await this.driversRepository.find({
            where,
            relations: ['user'],
            order: { createdAt: 'DESC' },
        });
        return drivers.map(this.toResponseDto);
    }

    async findOne(id: string): Promise<DriverResponseDto> {
        const driver = await this.driversRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!driver) {
            throw new NotFoundException('Driver not found');
        }
        return this.toResponseDto(driver);
    }

    async findOneEntity(id: string): Promise<Driver> {
        const driver = await this.driversRepository.findOne({ where: { id } });
        if (!driver) {
            throw new NotFoundException('Driver not found');
        }
        return driver;
    }

    async findByUserId(userId: string): Promise<Driver | null> {
        return this.driversRepository.findOne({ where: { userId } });
    }

    async findByUserIdDto(userId: string): Promise<DriverResponseDto> {
        const driver = await this.driversRepository.findOne({
            where: { userId },
            relations: ['user'],
        });
        if (!driver) {
            throw new NotFoundException('Driver not found');
        }
        return this.toResponseDto(driver);
    }

    async create(createDriverDto: CreateDriverDto): Promise<DriverResponseDto> {
        const driver = this.driversRepository.create(createDriverDto);
        await this.driversRepository.save(driver);

        const savedDriver = await this.driversRepository.findOne({
            where: { id: driver.id },
            relations: ['user'],
        });
        return this.toResponseDto(savedDriver!);
    }

    async updateStatus(id: string, updateDriverStatusDto: UpdateDriverStatusDto): Promise<DriverResponseDto> {
        const driver = await this.driversRepository.findOne({
            where: { id },
            relations: ['user'],
        });
        if (!driver) {
            throw new NotFoundException('Driver not found');
        }

        driver.status = updateDriverStatusDto.status;
        await this.driversRepository.save(driver);
        return this.toResponseDto(driver);
    }

    private toResponseDto(driver: Driver): DriverResponseDto {
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
