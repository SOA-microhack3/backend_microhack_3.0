"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
@(0, common_1.Injectable)()
class AppService {
    getHello() {
        return 'Hello World!';
    }
}
exports.AppService = AppService;
