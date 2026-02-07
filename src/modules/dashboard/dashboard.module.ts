import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';
import { Booking } from '../bookings/entities/booking.entity';
import { Truck } from '../trucks/entities/truck.entity';
import { Driver } from '../drivers/entities/driver.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Booking, Truck, Driver])],
    controllers: [DashboardController],
    providers: [DashboardService],
})
export class DashboardModule { }
