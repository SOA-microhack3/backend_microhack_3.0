import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../modules/users/users.service';
import { CarriersService } from '../modules/carriers/carriers.service';
import { DriversService } from '../modules/drivers/drivers.service';
import { TrucksService } from '../modules/trucks/trucks.service';
import { OperatorsService } from '../modules/operators/operators.service';
import { BookingsService } from '../modules/bookings/bookings.service';
import { PortsService } from '../modules/ports/ports.service';
import { TerminalsService } from '../modules/terminals/terminals.service';
import { UserRole } from '../common/enums';
import { UserResponseDto } from '../modules/users/dto';
import { CarrierResponseDto } from '../modules/carriers/dto';
import { DriverResponseDto } from '../modules/drivers/dto';
import { TruckResponseDto } from '../modules/trucks/dto';
import { OperatorResponseDto } from '../modules/operators/dto';

@Injectable()
export class DemoSeedService implements OnModuleInit {
  private readonly logger = new Logger(DemoSeedService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
    private readonly carriersService: CarriersService,
    private readonly driversService: DriversService,
    private readonly trucksService: TrucksService,
    private readonly operatorsService: OperatorsService,
    private readonly bookingsService: BookingsService,
    private readonly portsService: PortsService,
    private readonly terminalsService: TerminalsService,
  ) {}

  async onModuleInit() {
    const shouldSeed = this.configService.get<boolean>('seedDemo');
    if (shouldSeed === false) {
      return;
    }

    // Check if demo data already exists
    const carriers = await this.carriersService.findAll();
    if (carriers.length > 0) {
      return; // Already seeded
    }

    this.logger.log('Seeding demo data...');

    // Get ports and terminals
    const ports = await this.portsService.findAll();
    const terminals = await this.terminalsService.findAll();

    // Create demo users
    const demoUsers = [
      // Carriers
      { fullName: 'Ahmed Logistics', email: 'ahmed@carrier.com', password: 'demo123', role: UserRole.CARRIER },
      { fullName: 'Fatima Transport', email: 'fatima@carrier.com', password: 'demo123', role: UserRole.CARRIER },
      // Drivers
      { fullName: 'Mohammed Ali', email: 'mohammed@driver.com', password: 'demo123', role: UserRole.DRIVER },
      { fullName: 'Sara Hassan', email: 'sara@driver.com', password: 'demo123', role: UserRole.DRIVER },
      { fullName: 'Omar Khalid', email: 'omar@driver.com', password: 'demo123', role: UserRole.DRIVER },
      { fullName: 'Layla Mahmoud', email: 'layla@driver.com', password: 'demo123', role: UserRole.DRIVER },
      // Operators
      { fullName: 'Hassan Operator', email: 'hassan@operator.com', password: 'demo123', role: UserRole.OPERATOR },
      { fullName: 'Zahra Control', email: 'zahra@operator.com', password: 'demo123', role: UserRole.OPERATOR },
    ];

    const createdUsers: UserResponseDto[] = [];
    for (const userData of demoUsers) {
      try {
        const user = await this.usersService.create(userData);
        createdUsers.push(user);
      } catch (error) {
        this.logger.warn(`User ${userData.email} already exists, skipping...`);
      }
    }

    // Create carriers
    const carrierUsers = createdUsers.filter(u => u.role === UserRole.CARRIER);
    const carriersData = [
      { name: 'Ahmed Logistics Co.', userId: carrierUsers[0].id },
      { name: 'Fatima Transport Ltd.', userId: carrierUsers[1].id },
    ];

    const createdCarriers: CarrierResponseDto[] = [];
    for (const carrierData of carriersData) {
      const carrier = await this.carriersService.create(carrierData);
      createdCarriers.push(carrier);
    }

    // Create drivers
    const driverUsers = createdUsers.filter(u => u.role === UserRole.DRIVER);
    const driversData = [
      { userId: driverUsers[0].id, carrierId: createdCarriers[0].id },
      { userId: driverUsers[1].id, carrierId: createdCarriers[0].id },
      { userId: driverUsers[2].id, carrierId: createdCarriers[1].id },
      { userId: driverUsers[3].id, carrierId: createdCarriers[1].id },
    ];

    const createdDrivers: DriverResponseDto[] = [];
    for (const driverData of driversData) {
      const driver = await this.driversService.create(driverData);
      createdDrivers.push(driver);
    }

    // Create trucks
    const trucksData = [
      { plateNumber: 'ABC-123', carrierId: createdCarriers[0].id },
      { plateNumber: 'DEF-456', carrierId: createdCarriers[0].id },
      { plateNumber: 'GHI-789', carrierId: createdCarriers[1].id },
      { plateNumber: 'JKL-012', carrierId: createdCarriers[1].id },
    ];

    const createdTrucks: TruckResponseDto[] = [];
    for (const truckData of trucksData) {
      const truck = await this.trucksService.create(truckData);
      createdTrucks.push(truck);
    }

    // Create operators
    const operatorUsers = createdUsers.filter(u => u.role === UserRole.OPERATOR);
    const operatorsData = [
      { userId: operatorUsers[0].id, portId: ports[0].id, terminalId: terminals[0].id },
      { userId: operatorUsers[1].id, portId: ports[1].id, terminalId: terminals[1].id },
    ];

    const createdOperators: OperatorResponseDto[] = [];
    for (const operatorData of operatorsData) {
      const operator = await this.operatorsService.create(operatorData);
      createdOperators.push(operator);
    }

    // Create some bookings
    const now = new Date();
    const futureSlots = [
      new Date(now.getTime() + 1 * 60 * 60 * 1000), // 1 hour from now
      new Date(now.getTime() + 2 * 60 * 60 * 1000), // 2 hours from now
      new Date(now.getTime() + 24 * 60 * 60 * 1000), // Tomorrow
    ];

    const bookingsData = [
      { terminalId: terminals[0].id, carrierId: createdCarriers[0].id, truckId: createdTrucks[0].id, driverId: createdDrivers[0].id, slotStart: futureSlots[0] },
      { terminalId: terminals[1].id, carrierId: createdCarriers[1].id, truckId: createdTrucks[2].id, driverId: createdDrivers[2].id, slotStart: futureSlots[1] },
      { terminalId: terminals[2].id, carrierId: createdCarriers[0].id, truckId: createdTrucks[1].id, driverId: createdDrivers[1].id, slotStart: futureSlots[2] },
    ];

    for (const bookingData of bookingsData) {
      try {
        // Get the carrier's userId for the booking
        const carrier = createdCarriers.find(c => c.id === bookingData.carrierId);
        if (!carrier) continue;
        const carrierUser = createdUsers.find(u => u.id === carrier.userId);
        if (!carrierUser) continue;

        await this.bookingsService.create(bookingData, bookingData.carrierId, carrierUser.id);
      } catch (error) {
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
