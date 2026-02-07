import { BookingStatus } from '../../../common/enums';
import { Port } from '../../ports/entities/port.entity';
import { Terminal } from '../../terminals/entities/terminal.entity';
import { Carrier } from '../../carriers/entities/carrier.entity';
import { Truck } from '../../trucks/entities/truck.entity';
import { Driver } from '../../drivers/entities/driver.entity';
import { QrCode } from '../../qrcodes/entities/qrcode.entity';
export declare class Booking {
    id: string;
    portId: string;
    port: Port;
    terminalId: string;
    terminal: Terminal;
    carrierId: string;
    carrier: Carrier;
    truckId: string;
    truck: Truck;
    driverId: string;
    driver: Driver;
    status: BookingStatus;
    slotStart: Date;
    slotEnd: Date;
    slotsCount: number;
    bookingReference: string;
    createdAt: Date;
    updatedAt: Date;
    qrCodes: QrCode[];
}
