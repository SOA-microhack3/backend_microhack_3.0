"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const operator_entity_1 = require("../../operators/entities/operator.entity");
const carrier_entity_1 = require("../../carriers/entities/carrier.entity");
const driver_entity_1 = require("../../drivers/entities/driver.entity");
const notification_entity_1 = require("../../notifications/entities/notification.entity");
@(0, typeorm_1.Entity)('users')
class User {
    @(0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    id;
    @(0, typeorm_1.Column)({ name: 'full_name' })
    fullName;
    @(0, typeorm_1.Column)({ unique: true })
    email;
    @(0, typeorm_1.Column)({ name: 'password_hash' })
    passwordHash;
    @(0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.UserRole,
        default: enums_1.UserRole.DRIVER,
    })
    role;
    @(0, typeorm_1.Column)({ name: 'refresh_token', type: 'varchar', nullable: true })
    refreshToken;
    @(0, typeorm_1.Column)({ name: 'reset_password_token', type: 'varchar', nullable: true })
    resetPasswordToken;
    @(0, typeorm_1.Column)({ name: 'reset_password_expires', type: 'timestamp', nullable: true })
    resetPasswordExpires;
    @(0, typeorm_1.CreateDateColumn)({ name: 'created_at' })
    createdAt;
    @(0, typeorm_1.OneToOne)(() => operator_entity_1.Operator, (operator) => operator.user)
    operator;
    @(0, typeorm_1.OneToOne)(() => carrier_entity_1.Carrier, (carrier) => carrier.user)
    carrier;
    @(0, typeorm_1.OneToOne)(() => driver_entity_1.Driver, (driver) => driver.user)
    driver;
    @(0, typeorm_1.OneToMany)(() => notification_entity_1.Notification, (notification) => notification.user)
    notifications;
}
exports.User = User;
