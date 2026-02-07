"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Operator = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const user_entity_1 = require("../../users/entities/user.entity");
const port_entity_1 = require("../../ports/entities/port.entity");
const terminal_entity_1 = require("../../terminals/entities/terminal.entity");
@(0, typeorm_1.Entity)('operators')
class Operator {
    @(0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    id;
    @(0, typeorm_1.Column)({ name: 'user_id' })
    userId;
    @(0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.operator)
    @(0, typeorm_1.JoinColumn)({ name: 'user_id' })
    user;
    @(0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.OperatorStatus,
        default: enums_1.OperatorStatus.ACTIVE,
    })
    status;
    @(0, typeorm_1.Column)({ name: 'port_id' })
    portId;
    @(0, typeorm_1.ManyToOne)(() => port_entity_1.Port, (port) => port.operators)
    @(0, typeorm_1.JoinColumn)({ name: 'port_id' })
    port;
    @(0, typeorm_1.Column)({ name: 'terminal_id' })
    terminalId;
    @(0, typeorm_1.ManyToOne)(() => terminal_entity_1.Terminal, (terminal) => terminal.operators)
    @(0, typeorm_1.JoinColumn)({ name: 'terminal_id' })
    terminal;
    @(0, typeorm_1.CreateDateColumn)({ name: 'created_at' })
    createdAt;
}
exports.Operator = Operator;
