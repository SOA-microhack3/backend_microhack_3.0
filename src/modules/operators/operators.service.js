"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OperatorsService = void 0;
const common_1 = require("@nestjs/common");
@(0, common_1.Injectable)()
class OperatorsService {
    operatorsRepository;
    constructor(
    @(0, typeorm_1.InjectRepository)(operator_entity_1.Operator)
    operatorsRepository) {
        this.operatorsRepository = operatorsRepository;
    }
    async findAll() {
        const operators = await this.operatorsRepository.find({
            relations: ['user', 'port', 'terminal'],
            order: { createdAt: 'DESC' },
        });
        return operators.map(this.toResponseDto);
    }
    async findOne(id) {
        const operator = await this.operatorsRepository.findOne({
            where: { id },
            relations: ['user', 'port', 'terminal'],
        });
        if (!operator) {
            throw new common_1.NotFoundException('Operator not found');
        }
        return this.toResponseDto(operator);
    }
    async findByUserId(userId) {
        return this.operatorsRepository.findOne({
            where: { userId },
            relations: ['port', 'terminal'],
        });
    }
    async findByUserIdDto(userId) {
        const operator = await this.operatorsRepository.findOne({
            where: { userId },
            relations: ['port', 'terminal'],
        });
        if (!operator) {
            throw new common_1.NotFoundException('Operator not found');
        }
        return this.toResponseDto(operator);
    }
    async create(createOperatorDto) {
        const operator = this.operatorsRepository.create(createOperatorDto);
        await this.operatorsRepository.save(operator);
        return this.toResponseDto(operator);
    }
    async updateStatus(id, updateOperatorStatusDto) {
        const operator = await this.operatorsRepository.findOne({ where: { id } });
        if (!operator) {
            throw new common_1.NotFoundException('Operator not found');
        }
        operator.status = updateOperatorStatusDto.status;
        await this.operatorsRepository.save(operator);
        return this.toResponseDto(operator);
    }
    toResponseDto(operator) {
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
exports.OperatorsService = OperatorsService;
