import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PortsService } from '../modules/ports/ports.service';
import { TerminalsService } from '../modules/terminals/terminals.service';

@Injectable()
export class TerminalsSeedService implements OnModuleInit {
  private readonly logger = new Logger(TerminalsSeedService.name);

  constructor(
    private readonly terminalsService: TerminalsService,
    private readonly portsService: PortsService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const shouldSeed = this.configService.get<boolean>('terminals.seed');
    if (shouldSeed === false) {
      return;
    }

    const existing = await this.terminalsService.findAll();
    if (existing.length > 0) {
      return;
    }

    let ports = await this.portsService.findAll();

    if (ports.length === 0) {
      const defaults = [
        {
          name: 'Tanger Med',
          countryCode: 'MA',
          timezone: 'Africa/Casablanca',
          slotDuration: 60,
        },
        {
          name: 'Port de Casablanca',
          countryCode: 'MA',
          timezone: 'Africa/Casablanca',
          slotDuration: 60,
        },
        {
          name: "Port d'Agadir",
          countryCode: 'MA',
          timezone: 'Africa/Casablanca',
          slotDuration: 60,
        },
        {
          name: 'Port de Nador',
          countryCode: 'MA',
          timezone: 'Africa/Casablanca',
          slotDuration: 60,
        },
      ];

      for (const port of defaults) {
        await this.portsService.create(port);
      }

      ports = await this.portsService.findAll();
    }

    const terminalTemplates = [
      { name: 'Terminal A', maxCapacity: 50 },
      { name: 'Terminal B', maxCapacity: 40 },
    ];

    for (const port of ports) {
      for (const terminal of terminalTemplates) {
        await this.terminalsService.create({
          name: terminal.name,
          portId: port.id,
          maxCapacity: terminal.maxCapacity,
        });
      }
    }

    this.logger.log(
      `Seeded ${ports.length * terminalTemplates.length} terminals.`,
    );
  }
}
