"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Driver = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const user_entity_1 = require("../../users/entities/user.entity");
const carrier_entity_1 = require("../../carriers/entities/carrier.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
@(0, typeorm_1.Entity)('drivers')
class Driver {
    @(0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    id;
    @(0, typeorm_1.Column)({ name: 'user_id' })
    userId;
    @(0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.driver)
    @(0, typeorm_1.JoinColumn)({ name: 'user_id' })
    user;
    @(0, typeorm_1.Column)({ name: 'carrier_id' })
    carrierId;
    @(0, typeorm_1.ManyToOne)(() => carrier_entity_1.Carrier, (carrier) => carrier.drivers)
    @(0, typeorm_1.JoinColumn)({ name: 'carrier_id' })
    carrier;
    @(0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.DriverStatus,
        default: enums_1.DriverStatus.ACTIVE,
    })
    status;
    @(0, typeorm_1.CreateDateColumn)({ name: 'created_at' })
    createdAt;
    @(0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.driver)
    bookings;
}
exports.Driver = Driver;
