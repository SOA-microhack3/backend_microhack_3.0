"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppController = void 0;
const common_1 = require("@nestjs/common");
@(0, common_1.Controller)()
class AppController {
    appService;
    constructor(appService) {
        this.appService = appService;
    }
    @(0, common_1.Get)()
    getHello() {
        return this.appService.getHello();
    }
}
exports.AppController = AppController;
