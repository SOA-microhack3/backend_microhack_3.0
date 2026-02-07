"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Log = void 0;
const typeorm_1 = require("typeorm");
const enums_1 = require("../../../common/enums");
@(0, typeorm_1.Entity)('logs')
class Log {
    @(0, typeorm_1.PrimaryGeneratedColumn)('uuid')
    id;
    @(0, typeorm_1.Column)({ name: 'organization_id', nullable: true })
    organizationId;
    @(0, typeorm_1.Column)({
        name: 'actor_type',
        type: 'enum',
        enum: enums_1.ActorType,
    })
    actorType;
    @(0, typeorm_1.Column)({ name: 'actor_id', nullable: true })
    actorId;
    @(0, typeorm_1.Column)({
        name: 'entity_type',
        type: 'enum',
        enum: enums_1.EntityType,
    })
    entityType;
    @(0, typeorm_1.Column)({ name: 'entity_id' })
    entityId;
    @(0, typeorm_1.Column)({
        type: 'enum',
        enum: enums_1.LogAction,
    })
    action;
    @(0, typeorm_1.Column)({ type: 'text' })
    description;
    @(0, typeorm_1.CreateDateColumn)({ name: 'created_at' })
    createdAt;
}
exports.Log = Log;
