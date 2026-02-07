import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminalsController } from './terminals.controller';
import { TerminalsService } from './terminals.service';
import { Terminal } from './entities/terminal.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { Port } from '../ports/entities/port.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Terminal, Booking, Port])],
    controllers: [TerminalsController],
    providers: [TerminalsService],
    exports: [TerminalsService],
})
export class TerminalsModule { }
