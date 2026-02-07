"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const users_controller_1 = require("./users.controller");
const users_service_1 = require("./users.service");
const user_entity_1 = require("./entities/user.entity");
@(0, common_1.Module)({
    imports: [typeorm_1.TypeOrmModule.forFeature([user_entity_1.User])],
    controllers: [users_controller_1.UsersController],
    providers: [users_service_1.UsersService],
    exports: [users_service_1.UsersService],
})
class UsersModule {
}
exports.UsersModule = UsersModule;
