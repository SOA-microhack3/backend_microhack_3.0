import { Body, Controller, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards';
import { AiAgentService } from './ai-agent.service';
import { ChatDto } from './dto/chat.dto';
import { ConfirmBookingDto } from './dto/confirm-booking.dto';

@ApiTags('AI Agent')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class AiAgentController {
    constructor(private readonly aiAgentService: AiAgentService) { }

    @Post()
    @ApiOperation({ summary: 'Chat with an AI agent that can execute backend actions via tools' })
    @ApiResponse({ status: 200, description: 'AI final response' })
    async chat(@Body() body: ChatDto, @Req() req: Request): Promise<{ response: string; confirmation?: any; conversationId: string }> {
        const user = (req as any).user;
        const response = await this.aiAgentService.chat({
            message: body.message,
            user,
            conversationId: body.conversationId,
        });
        return response;
    }

    @Get('conversations')
    @ApiOperation({ summary: 'List chat conversations for the current user' })
    @ApiResponse({ status: 200, description: 'List of conversations' })
    async listConversations(@Req() req: Request): Promise<any[]> {
        const user = (req as any).user;
        return this.aiAgentService.listConversations(user);
    }

    @Get('conversations/:conversationId/messages')
    @ApiOperation({ summary: 'Get messages for a conversation' })
    @ApiQuery({ name: 'limit', required: false, example: 50 })
    @ApiQuery({ name: 'offset', required: false, example: 0 })
    @ApiResponse({ status: 200, description: 'Conversation messages' })
    async getConversationMessages(
        @Param('conversationId') conversationId: string,
        @Req() req: Request,
        @Query('limit') limit?: string,
        @Query('offset') offset?: string,
    ): Promise<any[]> {
        const user = (req as any).user;
        const parsedLimit = limit ? Number(limit) : 50;
        const parsedOffset = offset ? Number(offset) : 0;
        return this.aiAgentService.getConversationMessages(
            user,
            conversationId,
            Number.isFinite(parsedLimit) ? parsedLimit : 50,
            Number.isFinite(parsedOffset) ? parsedOffset : 0,
        );
    }

    @Post('confirm')
    @ApiOperation({ summary: 'Confirm a pending booking prepared by the AI agent' })
    @ApiResponse({ status: 200, description: 'Booking confirmed' })
    async confirmBooking(
        @Body() body: ConfirmBookingDto,
        @Req() req: Request,
    ): Promise<{ response: string; booking: any; conversationId: string }> {
        const user = (req as any).user;
        return this.aiAgentService.confirmBooking({
            confirmationId: body.confirmationId,
            user,
            conversationId: body.conversationId,
        });
    }
}
