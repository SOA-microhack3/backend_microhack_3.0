import { Module } from '@nestjs/common';
import { AiAgentController } from './ai-agent.controller';
import { AiAgentService } from './ai-agent.service';
import { UsersModule } from '../users/users.module';
import { BookingsModule } from '../bookings/bookings.module';
import { CarriersModule } from '../carriers/carriers.module';
import { OperatorsModule } from '../operators/operators.module';
import { TerminalsModule } from '../terminals/terminals.module';

@Module({
    imports: [UsersModule, BookingsModule, CarriersModule, OperatorsModule, TerminalsModule],
    controllers: [AiAgentController],
    providers: [AiAgentService],
})
export class AiAgentModule { }
