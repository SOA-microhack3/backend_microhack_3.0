"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TerminalsSeedService = void 0;
const common_1 = require("@nestjs/common");
@(0, common_1.Injectable)()
class TerminalsSeedService {
    terminalsService;
    portsService;
    configService;
    logger = new common_1.Logger(TerminalsSeedService.name);
    constructor(terminalsService, portsService, configService) {
        this.terminalsService = terminalsService;
        this.portsService = portsService;
        this.configService = configService;
    }
    async onModuleInit() {
        const shouldSeed = this.configService.get('terminals.seed');
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
        this.logger.log(`Seeded ${ports.length * terminalTemplates.length} terminals.`);
    }
}
exports.TerminalsSeedService = TerminalsSeedService;
