"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PortsSeedService = void 0;
const common_1 = require("@nestjs/common");
@(0, common_1.Injectable)()
class PortsSeedService {
    portsService;
    configService;
    logger = new common_1.Logger(PortsSeedService.name);
    constructor(portsService, configService) {
        this.portsService = portsService;
        this.configService = configService;
    }
    async onModuleInit() {
        const shouldSeed = this.configService.get('ports.seed');
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
exports.PortsSeedService = PortsSeedService;
