import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TrucksController } from './trucks.controller';
import { TrucksService } from './trucks.service';
import { Truck } from './entities/truck.entity';
import { Booking } from '../bookings/entities/booking.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Truck, Booking])],
    controllers: [TrucksController],
    providers: [TrucksService],
    exports: [TrucksService],
})
export class TrucksModule { }
