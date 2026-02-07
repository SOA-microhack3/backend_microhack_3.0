import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import type { Request } from 'express';
import { JwtAuthGuard } from '../../common/guards';
import { AiAgentService } from './ai-agent.service';
import { ChatDto } from './dto/chat.dto';

@ApiTags('AI Agent')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('chat')
export class AiAgentController {
    constructor(private readonly aiAgentService: AiAgentService) { }

    @Post()
    @ApiOperation({ summary: 'Chat with an AI agent that can execute backend actions via tools' })
    @ApiResponse({ status: 200, description: 'AI final response' })
    async chat(@Body() body: ChatDto, @Req() req: Request): Promise<{ response: string }> {
        const user = (req as any).user;
        const response = await this.aiAgentService.chat({ message: body.message, user });
        return { response };
    }
}
