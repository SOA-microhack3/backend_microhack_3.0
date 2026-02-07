import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../modules/users/users.service';
import { CarriersService } from '../modules/carriers/carriers.service';
import { DriversService } from '../modules/drivers/drivers.service';
import { TrucksService } from '../modules/trucks/trucks.service';
import { OperatorsService } from '../modules/operators/operators.service';
import { BookingsService } from '../modules/bookings/bookings.service';
import { PortsService } from '../modules/ports/ports.service';
import { TerminalsService } from '../modules/terminals/terminals.service';
export declare class DemoSeedService implements OnModuleInit {
    private readonly configService;
    private readonly usersService;
    private readonly carriersService;
    private readonly driversService;
    private readonly trucksService;
    private readonly operatorsService;
    private readonly bookingsService;
    private readonly portsService;
    private readonly terminalsService;
    private readonly logger;
    constructor(configService: ConfigService, usersService: UsersService, carriersService: CarriersService, driversService: DriversService, trucksService: TrucksService, operatorsService: OperatorsService, bookingsService: BookingsService, portsService: PortsService, terminalsService: TerminalsService);
    onModuleInit(): Promise<void>;
}
