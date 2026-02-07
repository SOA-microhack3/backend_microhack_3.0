"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationsModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const notifications_controller_1 = require("./notifications.controller");
const notifications_service_1 = require("./notifications.service");
const notification_entity_1 = require("./entities/notification.entity");
@(0, common_1.Module)({
    imports: [typeorm_1.TypeOrmModule.forFeature([notification_entity_1.Notification])],
    controllers: [notifications_controller_1.NotificationsController],
    providers: [notifications_service_1.NotificationsService],
    exports: [notifications_service_1.NotificationsService],
})
class NotificationsModule {
}
exports.NotificationsModule = NotificationsModule;
