import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PortsService } from '../modules/ports/ports.service';
export declare class PortsSeedService implements OnModuleInit {
    private readonly portsService;
    private readonly configService;
    private readonly logger;
    constructor(portsService: PortsService, configService: ConfigService);
    onModuleInit(): Promise<void>;
}
