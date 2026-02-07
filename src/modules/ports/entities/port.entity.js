"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Port = void 0;
const typeorm_1 = require("typeorm");
const terminal_entity_1 = require("../../terminals/entities/terminal.entity");
const operator_entity_1 = require("../../operators/entities/operator.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
@(0, typeorm_1.Entity)('ports')
class Port {
    @(0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    id;
    @(0, typeorm_1.Column)()
    name;
    @(0, typeorm_1.Column)({ name: 'country_code' })
    countryCode;
    @(0, typeorm_1.Column)({ default: 'UTC' })
    timezone;
    @(0, typeorm_1.Column)({ name: 'slot_duration', default: 60 })
    slotDuration;
    @(0, typeorm_1.CreateDateColumn)({ name: 'created_at' })
    createdAt;
    @(0, typeorm_1.OneToMany)(() => terminal_entity_1.Terminal, (terminal) => terminal.port)
    terminals;
    @(0, typeorm_1.OneToMany)(() => operator_entity_1.Operator, (operator) => operator.port)
    operators;
    @(0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.port)
    bookings;
}
exports.Port = Port;
