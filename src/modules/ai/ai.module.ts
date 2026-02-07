import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';
import { Booking } from '../bookings/entities/booking.entity';
import { Terminal } from '../terminals/entities/terminal.entity';
import { Carrier } from '../carriers/entities/carrier.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Booking, Terminal, Carrier])],
    controllers: [AiController],
    providers: [AiService],
})
export class AiModule { }
