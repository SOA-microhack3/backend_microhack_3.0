import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Operator } from './entities/operator.entity';
import { CreateOperatorDto, UpdateOperatorStatusDto, OperatorResponseDto } from './dto';

@Injectable()
export class OperatorsService {
    constructor(
        @InjectRepository(Operator)
        private operatorsRepository: Repository<Operator>,
    ) { }

    async findAll(): Promise<OperatorResponseDto[]> {
        const operators = await this.operatorsRepository.find({
            relations: ['user', 'port', 'terminal'],
            order: { createdAt: 'DESC' },
        });
        return operators.map(this.toResponseDto);
    }

    async findOne(id: string): Promise<OperatorResponseDto> {
        const operator = await this.operatorsRepository.findOne({
            where: { id },
            relations: ['user', 'port', 'terminal'],
        });
        if (!operator) {
            throw new NotFoundException('Operator not found');
        }
        return this.toResponseDto(operator);
    }

    async findByUserId(userId: string): Promise<Operator | null> {
        return this.operatorsRepository.findOne({
            where: { userId },
            relations: ['port', 'terminal'],
        });
    }

    async findByUserIdDto(userId: string): Promise<OperatorResponseDto> {
        const operator = await this.operatorsRepository.findOne({
            where: { userId },
            relations: ['port', 'terminal'],
        });
        if (!operator) {
            throw new NotFoundException('Operator not found');
        }
        return this.toResponseDto(operator);
    }

    async create(createOperatorDto: CreateOperatorDto): Promise<OperatorResponseDto> {
        const operator = this.operatorsRepository.create(createOperatorDto);
        await this.operatorsRepository.save(operator);
        return this.toResponseDto(operator);
    }

    async updateStatus(id: string, updateOperatorStatusDto: UpdateOperatorStatusDto): Promise<OperatorResponseDto> {
        const operator = await this.operatorsRepository.findOne({ where: { id } });
        if (!operator) {
            throw new NotFoundException('Operator not found');
        }

        operator.status = updateOperatorStatusDto.status;
        await this.operatorsRepository.save(operator);
        return this.toResponseDto(operator);
    }

    private toResponseDto(operator: Operator): OperatorResponseDto {
        return {
            id: operator.id,
            userId: operator.userId,
            portId: operator.portId,
            terminalId: operator.terminalId,
            status: operator.status,
            createdAt: operator.createdAt,
        };
    }
}
