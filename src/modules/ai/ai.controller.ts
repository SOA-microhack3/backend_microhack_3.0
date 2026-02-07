import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../../common/guards';

@ApiTags('AI Integration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('ai')
export class AiController {
    constructor(private readonly aiService: AiService) { }

    @Get('availability')
    @ApiOperation({ summary: 'Get slot availability for AI agent' })
    @ApiQuery({ name: 'terminal', required: true, example: 'Terminal A' })
    @ApiQuery({ name: 'date', required: true, example: 'tomorrow' })
    @ApiQuery({ name: 'time', required: false, example: '8-10' })
    async getAvailability(
        @Query('terminal') terminal: string,
        @Query('date') date: string,
        @Query('time') time?: string,
    ): Promise<any> {
        return this.aiService.getAvailability(terminal, date, time);
    }

    @Get('booking-status')
    @ApiOperation({ summary: 'Get booking status for AI agent' })
    @ApiQuery({ name: 'reference', required: true, example: 'BK-ABC123' })
    async getBookingStatus(@Query('reference') reference: string): Promise<any> {
        return this.aiService.getBookingStatus(reference);
    }

    @Get('carrier-history')
    @ApiOperation({ summary: 'Get carrier history for AI agent' })
    @ApiQuery({ name: 'carrierId', required: true })
    @ApiQuery({ name: 'days', required: false, example: 30 })
    async getCarrierHistory(
        @Query('carrierId') carrierId: string,
        @Query('days') days?: number,
    ): Promise<any> {
        return this.aiService.getCarrierHistory(carrierId, days || 30);
    }

    @Post('booking-suggestions')
    @ApiOperation({ summary: 'Get smart booking suggestions for multiple trucks' })
    async getBookingSuggestions(
        @Body() body: {
            carrierId: string;
            truckCount: number;
            preferredTerminal: string;
            preferredDate: string;
        },
    ): Promise<any> {
        return this.aiService.getBookingSuggestions(
            body.carrierId,
            body.truckCount,
            body.preferredTerminal,
            body.preferredDate,
        );
    }
}
