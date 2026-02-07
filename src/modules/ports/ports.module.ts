import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PortsController } from './ports.controller';
import { PortsService } from './ports.service';
import { Port } from './entities/port.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Port])],
    controllers: [PortsController],
    providers: [PortsService],
    exports: [PortsService],
})
export class PortsModule { }
