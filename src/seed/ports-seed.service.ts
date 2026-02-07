import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PortsService } from '../modules/ports/ports.service';

@Injectable()
export class PortsSeedService implements OnModuleInit {
  private readonly logger = new Logger(PortsSeedService.name);

  constructor(
    private readonly portsService: PortsService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const shouldSeed = this.configService.get<boolean>('ports.seed');
    if (shouldSeed === false) {
      return;
    }

    const existing = await this.portsService.findAll();
    if (existing.length > 0) {
      return;
    }

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
        name: 'Port d\'Agadir',
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

    this.logger.log(`Seeded ${defaults.length} default ports.`);
  }
}
