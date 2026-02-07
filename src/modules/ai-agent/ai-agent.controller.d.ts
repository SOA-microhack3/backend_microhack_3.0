import type { Request } from 'express';
import { AiAgentService } from './ai-agent.service';
import { ChatDto } from './dto/chat.dto';
export declare class AiAgentController {
    private readonly aiAgentService;
    constructor(aiAgentService: AiAgentService);
    chat(body: ChatDto, req: Request): Promise<{
        response: string;
    }>;
}
