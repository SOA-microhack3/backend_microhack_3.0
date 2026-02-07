"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Terminal = void 0;
const typeorm_1 = require("typeorm");
const port_entity_1 = require("../../ports/entities/port.entity");
const operator_entity_1 = require("../../operators/entities/operator.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
@(0, typeorm_1.Entity)('terminals')
class Terminal {
    @(0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    id;
    @(0, typeorm_1.Column)()
    name;
    @(0, typeorm_1.Column)({ name: 'port_id' })
    portId;
    @(0, typeorm_1.ManyToOne)(() => port_entity_1.Port, (port) => port.terminals)
    @(0, typeorm_1.JoinColumn)({ name: 'port_id' })
    port;
    @(0, typeorm_1.Column)({ name: 'max_capacity' })
    maxCapacity;
    @(0, typeorm_1.CreateDateColumn)({ name: 'created_at' })
    createdAt;
    @(0, typeorm_1.OneToMany)(() => operator_entity_1.Operator, (operator) => operator.terminal)
    operators;
    @(0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.terminal)
    bookings;
}
exports.Terminal = Terminal;
