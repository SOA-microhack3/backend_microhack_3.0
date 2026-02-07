"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiAgentController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../../common/guards");
@(0, swagger_1.ApiTags)('AI Agent')
@(0, swagger_1.ApiBearerAuth)()
@(0, common_1.UseGuards)(guards_1.JwtAuthGuard)
@(0, common_1.Controller)('chat')
class AiAgentController {
    aiAgentService;
    constructor(aiAgentService) {
        this.aiAgentService = aiAgentService;
    }
    @(0, common_1.Post)()
    @(0, swagger_1.ApiOperation)({ summary: 'Chat with an AI agent that can execute backend actions via tools' })
    @(0, swagger_1.ApiResponse)({ status: 200, description: 'AI final response' })
    async chat(
    @(0, common_1.Body)()
    body, 
    @(0, common_1.Req)()
    req) {
        const user = req.user;
        const response = await this.aiAgentService.chat({ message: body.message, user });
        return { response };
    }
}
exports.AiAgentController = AiAgentController;
