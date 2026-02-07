"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ChatDto {
    @(0, swagger_1.ApiProperty)({ example: 'Show me my pending bookings for tomorrow.' })
    @(0, class_validator_1.IsString)()
    @(0, class_validator_1.MinLength)(1)
    message;
}
exports.ChatDto = ChatDto;
