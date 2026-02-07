import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PortsService } from '../modules/ports/ports.service';
import { TerminalsService } from '../modules/terminals/terminals.service';
export declare class TerminalsSeedService implements OnModuleInit {
    private readonly terminalsService;
    private readonly portsService;
    private readonly configService;
    private readonly logger;
    constructor(terminalsService: TerminalsService, portsService: PortsService, configService: ConfigService);
    onModuleInit(): Promise<void>;
}
