"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Booking = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const port_entity_1 = require("../../ports/entities/port.entity");
const terminal_entity_1 = require("../../terminals/entities/terminal.entity");
const carrier_entity_1 = require("../../carriers/entities/carrier.entity");
const truck_entity_1 = require("../../trucks/entities/truck.entity");
const driver_entity_1 = require("../../drivers/entities/driver.entity");
const qrcode_entity_1 = require("../../qrcodes/entities/qrcode.entity");
@(0, typeorm_1.Entity)('bookings')
class Booking {
    @(0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    id;
    @(0, typeorm_1.Column)({ name: 'port_id' })
    portId;
    @(0, typeorm_1.ManyToOne)(() => port_entity_1.Port, (port) => port.bookings)
    @(0, typeorm_1.JoinColumn)({ name: 'port_id' })
    port;
    @(0, typeorm_1.Column)({ name: 'terminal_id' })
    terminalId;
    @(0, typeorm_1.ManyToOne)(() => terminal_entity_1.Terminal, (terminal) => terminal.bookings)
    @(0, typeorm_1.JoinColumn)({ name: 'terminal_id' })
    terminal;
    @(0, typeorm_1.Column)({ name: 'carrier_id' })
    carrierId;
    @(0, typeorm_1.ManyToOne)(() => carrier_entity_1.Carrier, (carrier) => carrier.bookings)
    @(0, typeorm_1.JoinColumn)({ name: 'carrier_id' })
    carrier;
    @(0, typeorm_1.Column)({ name: 'truck_id' })
    truckId;
    @(0, typeorm_1.ManyToOne)(() => truck_entity_1.Truck, (truck) => truck.bookings)
    @(0, typeorm_1.JoinColumn)({ name: 'truck_id' })
    truck;
    @(0, typeorm_1.Column)({ name: 'driver_id' })
    driverId;
    @(0, typeorm_1.ManyToOne)(() => driver_entity_1.Driver, (driver) => driver.bookings)
    @(0, typeorm_1.JoinColumn)({ name: 'driver_id' })
    driver;
    @(0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.BookingStatus,
        default: enums_1.BookingStatus.PENDING,
    })
    status;
    @(0, typeorm_1.Column)({ name: 'slot_start', type: 'timestamp' })
    slotStart;
    @(0, typeorm_1.Column)({ name: 'slot_end', type: 'timestamp' })
    slotEnd;
    @(0, typeorm_1.Column)({ name: 'slots_count', default: 1 })
    slotsCount;
    @(0, typeorm_1.Column)({ name: 'booking_reference', unique: true })
    bookingReference;
    @(0, typeorm_1.CreateDateColumn)({ name: 'created_at' })
    createdAt;
    @(0, typeorm_1.UpdateDateColumn)({ name: 'updated_at' })
    updatedAt;
    @(0, typeorm_1.OneToMany)(() => qrcode_entity_1.QrCode, (qrCode) => qrCode.booking)
    qrCodes;
}
exports.Booking = Booking;
