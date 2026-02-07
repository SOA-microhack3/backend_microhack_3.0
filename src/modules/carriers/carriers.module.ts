import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarriersController } from './carriers.controller';
import { CarriersService } from './carriers.service';
import { Carrier } from './entities/carrier.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Carrier])],
    controllers: [CarriersController],
    providers: [CarriersService],
    exports: [CarriersService],
})
export class CarriersModule { }
