"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Truck = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const carrier_entity_1 = require("../../carriers/entities/carrier.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
@(0, typeorm_1.Entity)('trucks')
class Truck {
    @(0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    id;
    @(0, typeorm_1.Column)({ name: 'plate_number', unique: true })
    plateNumber;
    @(0, typeorm_1.Column)({ name: 'carrier_id' })
    carrierId;
    @(0, typeorm_1.ManyToOne)(() => carrier_entity_1.Carrier, (carrier) => carrier.trucks)
    @(0, typeorm_1.JoinColumn)({ name: 'carrier_id' })
    carrier;
    @(0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.TruckStatus,
        default: enums_1.TruckStatus.ACTIVE,
    })
    status;
    @(0, typeorm_1.CreateDateColumn)({ name: 'created_at' })
    createdAt;
    @(0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.truck)
    bookings;
}
exports.Truck = Truck;
