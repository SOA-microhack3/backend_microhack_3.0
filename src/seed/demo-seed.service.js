"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DemoSeedService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../common/enums");
@(0, common_1.Injectable)()
class DemoSeedService {
    configService;
    usersService;
    carriersService;
    driversService;
    trucksService;
    operatorsService;
    bookingsService;
    portsService;
    terminalsService;
    logger = new common_1.Logger(DemoSeedService.name);
    constructor(configService, usersService, carriersService, driversService, trucksService, operatorsService, bookingsService, portsService, terminalsService) {
        this.configService = configService;
        this.usersService = usersService;
        this.carriersService = carriersService;
        this.driversService = driversService;
        this.trucksService = trucksService;
        this.operatorsService = operatorsService;
        this.bookingsService = bookingsService;
        this.portsService = portsService;
        this.terminalsService = terminalsService;
    }
    async onModuleInit() {
        const shouldSeed = this.configService.get('seedDemo');
        if (shouldSeed === false) {
            return;
        }
        const carriers = await this.carriersService.findAll();
        if (carriers.length > 0) {
            return;
        }
        this.logger.log('Seeding demo data...');
        const ports = await this.portsService.findAll();
        const terminals = await this.terminalsService.findAll();
        const demoUsers = [
            { fullName: 'Ahmed Logistics', email: 'ahmed@carrier.com', password: 'demo123', role: enums_1.UserRole.CARRIER },
            { fullName: 'Fatima Transport', email: 'fatima@carrier.com', password: 'demo123', role: enums_1.UserRole.CARRIER },
            { fullName: 'Mohammed Ali', email: 'mohammed@driver.com', password: 'demo123', role: enums_1.UserRole.DRIVER },
            { fullName: 'Sara Hassan', email: 'sara@driver.com', password: 'demo123', role: enums_1.UserRole.DRIVER },
            { fullName: 'Omar Khalid', email: 'omar@driver.com', password: 'demo123', role: enums_1.UserRole.DRIVER },
            { fullName: 'Layla Mahmoud', email: 'layla@driver.com', password: 'demo123', role: enums_1.UserRole.DRIVER },
            { fullName: 'Hassan Operator', email: 'hassan@operator.com', password: 'demo123', role: enums_1.UserRole.OPERATOR },
            { fullName: 'Zahra Control', email: 'zahra@operator.com', password: 'demo123', role: enums_1.UserRole.OPERATOR },
        ];
        const createdUsers = [];
        for (const userData of demoUsers) {
            try {
                const user = await this.usersService.create(userData);
                createdUsers.push(user);
            }
            catch (error) {
                this.logger.warn(`User ${userData.email} already exists, skipping...`);
            }
        }
        const carrierUsers = createdUsers.filter(u => u.role === enums_1.UserRole.CARRIER);
        const carriersData = [
            { name: 'Ahmed Logistics Co.', userId: carrierUsers[0].id },
            { name: 'Fatima Transport Ltd.', userId: carrierUsers[1].id },
        ];
        const createdCarriers = [];
        for (const carrierData of carriersData) {
            const carrier = await this.carriersService.create(carrierData);
            createdCarriers.push(carrier);
        }
        const driverUsers = createdUsers.filter(u => u.role === enums_1.UserRole.DRIVER);
        const driversData = [
            { userId: driverUsers[0].id, carrierId: createdCarriers[0].id },
            { userId: driverUsers[1].id, carrierId: createdCarriers[0].id },
            { userId: driverUsers[2].id, carrierId: createdCarriers[1].id },
            { userId: driverUsers[3].id, carrierId: createdCarriers[1].id },
        ];
        const createdDrivers = [];
        for (const driverData of driversData) {
            const driver = await this.driversService.create(driverData);
            createdDrivers.push(driver);
        }
        const trucksData = [
            { plateNumber: 'ABC-123', carrierId: createdCarriers[0].id },
            { plateNumber: 'DEF-456', carrierId: createdCarriers[0].id },
            { plateNumber: 'GHI-789', carrierId: createdCarriers[1].id },
            { plateNumber: 'JKL-012', carrierId: createdCarriers[1].id },
        ];
        const createdTrucks = [];
        for (const truckData of trucksData) {
            const truck = await this.trucksService.create(truckData);
            createdTrucks.push(truck);
        }
        const operatorUsers = createdUsers.filter(u => u.role === enums_1.UserRole.OPERATOR);
        const operatorsData = [
            { userId: operatorUsers[0].id, portId: ports[0].id, terminalId: terminals[0].id },
            { userId: operatorUsers[1].id, portId: ports[1].id, terminalId: terminals[1].id },
        ];
        const createdOperators = [];
        for (const operatorData of operatorsData) {
            const operator = await this.operatorsService.create(operatorData);
            createdOperators.push(operator);
        }
        const now = new Date();
        const futureSlots = [
            new Date(now.getTime() + 1 * 60 * 60 * 1000),
            new Date(now.getTime() + 2 * 60 * 60 * 1000),
            new Date(now.getTime() + 24 * 60 * 60 * 1000),
        ];
        const bookingsData = [
            { terminalId: terminals[0].id, carrierId: createdCarriers[0].id, truckId: createdTrucks[0].id, driverId: createdDrivers[0].id, slotStart: futureSlots[0] },
            { terminalId: terminals[1].id, carrierId: createdCarriers[1].id, truckId: createdTrucks[2].id, driverId: createdDrivers[2].id, slotStart: futureSlots[1] },
            { terminalId: terminals[2].id, carrierId: createdCarriers[0].id, truckId: createdTrucks[1].id, driverId: createdDrivers[1].id, slotStart: futureSlots[2] },
        ];
        for (const bookingData of bookingsData) {
            try {
                const carrier = createdCarriers.find(c => c.id === bookingData.carrierId);
                if (!carrier)
                    continue;
                const carrierUser = createdUsers.find(u => u.id === carrier.userId);
                if (!carrierUser)
                    continue;
                await this.bookingsService.create(bookingData, bookingData.carrierId, carrierUser.id);
            }
            catch (error) {
                this.logger.warn(`Failed to create booking: ${error.message}`);
            }
        }
        this.logger.log(`Demo data seeded successfully:
- ${createdUsers.length} users
- ${createdCarriers.length} carriers
- ${createdDrivers.length} drivers
- ${createdTrucks.length} trucks
- ${createdOperators.length} operators
- ${bookingsData.length} bookings`);
    }
}
exports.DemoSeedService = DemoSeedService;
