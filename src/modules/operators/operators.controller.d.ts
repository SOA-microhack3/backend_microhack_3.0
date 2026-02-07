import { OperatorsService } from './operators.service';
import { CreateOperatorDto, UpdateOperatorStatusDto, OperatorResponseDto } from './dto';
export declare class OperatorsController {
    private readonly operatorsService;
    constructor(operatorsService: OperatorsService);
    findAll(): Promise<OperatorResponseDto[]>;
    getMe(userId: string): Promise<OperatorResponseDto>;
    findOne(id: string): Promise<OperatorResponseDto>;
    create(createOperatorDto: CreateOperatorDto): Promise<OperatorResponseDto>;
    updateStatus(id: string, updateOperatorStatusDto: UpdateOperatorStatusDto): Promise<OperatorResponseDto>;
}
