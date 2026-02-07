"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Carrier = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../users/entities/user.entity");
const driver_entity_1 = require("../../drivers/entities/driver.entity");
const truck_entity_1 = require("../../trucks/entities/truck.entity");
const booking_entity_1 = require("../../bookings/entities/booking.entity");
@(0, typeorm_1.Entity)('carriers')
class Carrier {
    @(0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    id;
    @(0, typeorm_1.Column)({ name: 'user_id' })
    userId;
    @(0, typeorm_1.OneToOne)(() => user_entity_1.User, (user) => user.carrier)
    @(0, typeorm_1.JoinColumn)({ name: 'user_id' })
    user;
    @(0, typeorm_1.Column)()
    name;
    @(0, typeorm_1.CreateDateColumn)({ name: 'created_at' })
    createdAt;
    @(0, typeorm_1.OneToMany)(() => driver_entity_1.Driver, (driver) => driver.carrier)
    drivers;
    @(0, typeorm_1.OneToMany)(() => truck_entity_1.Truck, (truck) => truck.carrier)
    trucks;
    @(0, typeorm_1.OneToMany)(() => booking_entity_1.Booking, (booking) => booking.carrier)
    bookings;
}
exports.Carrier = Carrier;
