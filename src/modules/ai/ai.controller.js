"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const guards_1 = require("../../common/guards");
@(0, swagger_1.ApiTags)('AI Integration')
@(0, swagger_1.ApiBearerAuth)()
@(0, common_1.UseGuards)(guards_1.JwtAuthGuard)
@(0, common_1.Controller)('ai')
class AiController {
    aiService;
    constructor(aiService) {
        this.aiService = aiService;
    }
    @(0, common_1.Get)('availability')
    @(0, swagger_1.ApiOperation)({ summary: 'Get slot availability for AI agent' })
    @(0, swagger_1.ApiQuery)({ name: 'terminal', required: true, example: 'Terminal A' })
    @(0, swagger_1.ApiQuery)({ name: 'date', required: true, example: 'tomorrow' })
    @(0, swagger_1.ApiQuery)({ name: 'time', required: false, example: '8-10' })
    async getAvailability(
    @(0, common_1.Query)('terminal')
    terminal, 
    @(0, common_1.Query)('date')
    date, 
    @(0, common_1.Query)('time')
    time) {
        return this.aiService.getAvailability(terminal, date, time);
    }
    @(0, common_1.Get)('booking-status')
    @(0, swagger_1.ApiOperation)({ summary: 'Get booking status for AI agent' })
    @(0, swagger_1.ApiQuery)({ name: 'reference', required: true, example: 'BK-ABC123' })
    async getBookingStatus(
    @(0, common_1.Query)('reference')
    reference) {
        return this.aiService.getBookingStatus(reference);
    }
    @(0, common_1.Get)('carrier-history')
    @(0, swagger_1.ApiOperation)({ summary: 'Get carrier history for AI agent' })
    @(0, swagger_1.ApiQuery)({ name: 'carrierId', required: true })
    @(0, swagger_1.ApiQuery)({ name: 'days', required: false, example: 30 })
    async getCarrierHistory(
    @(0, common_1.Query)('carrierId')
    carrierId, 
    @(0, common_1.Query)('days')
    days) {
        return this.aiService.getCarrierHistory(carrierId, days || 30);
    }
    @(0, common_1.Post)('booking-suggestions')
    @(0, swagger_1.ApiOperation)({ summary: 'Get smart booking suggestions for multiple trucks' })
    async getBookingSuggestions(
    @(0, common_1.Body)()
    body) {
        return this.aiService.getBookingSuggestions(body.carrierId, body.truckCount, body.preferredTerminal, body.preferredDate);
    }
}
exports.AiController = AiController;
