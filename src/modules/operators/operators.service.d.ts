import { Repository } from 'typeorm';
import { Operator } from './entities/operator.entity';
import { CreateOperatorDto, UpdateOperatorStatusDto, OperatorResponseDto } from './dto';
export declare class OperatorsService {
    private operatorsRepository;
    constructor(operatorsRepository: Repository<Operator>);
    findAll(): Promise<OperatorResponseDto[]>;
    findOne(id: string): Promise<OperatorResponseDto>;
    findByUserId(userId: string): Promise<Operator | null>;
    findByUserIdDto(userId: string): Promise<OperatorResponseDto>;
    create(createOperatorDto: CreateOperatorDto): Promise<OperatorResponseDto>;
    updateStatus(id: string, updateOperatorStatusDto: UpdateOperatorStatusDto): Promise<OperatorResponseDto>;
    private toResponseDto;
}
