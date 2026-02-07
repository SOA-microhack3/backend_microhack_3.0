import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiAgentController } from './ai-agent.controller';
import { AiAgentService } from './ai-agent.service';
import { UsersModule } from '../users/users.module';
import { BookingsModule } from '../bookings/bookings.module';
import { CarriersModule } from '../carriers/carriers.module';
import { OperatorsModule } from '../operators/operators.module';
import { TerminalsModule } from '../terminals/terminals.module';
import { ChatConversation } from './entities/chat-conversation.entity';
import { ChatMessage } from './entities/chat-message.entity';

@Module({
    imports: [
        UsersModule,
        BookingsModule,
        CarriersModule,
        OperatorsModule,
        TerminalsModule,
        TypeOrmModule.forFeature([ChatConversation, ChatMessage]),
    ],
    controllers: [AiAgentController],
    providers: [AiAgentService],
})
export class AiAgentModule { }
