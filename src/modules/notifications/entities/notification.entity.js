"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Notification = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
const user_entity_1 = require("../../users/entities/user.entity");
@(0, typeorm_1.Entity)('notifications')
class Notification {
    @(0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    id;
    @(0, typeorm_1.Column)({ name: 'user_id' })
    userId;
    @(0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.notifications)
    @(0, typeorm_1.JoinColumn)({ name: 'user_id' })
    user;
    @(0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.NotificationType,
    })
    type;
    @(0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.NotificationSource,
    })
    source;
    @(0, typeorm_1.Column)({ type: 'text' })
    message;
    @(0, typeorm_1.Column)({ name: 'read_at', type: 'timestamp', nullable: true })
    readAt;
    @(0, typeorm_1.CreateDateColumn)({ name: 'created_at' })
    createdAt;
}
exports.Notification = Notification;
