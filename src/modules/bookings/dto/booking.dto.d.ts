import { BookingStatus } from '../../../common/enums';
export declare class CreateBookingDto {
    terminalId: string;
    carrierId?: string;
    truckId: string;
    driverId: string;
    slotStart: Date;
    slotsCount?: number;
}
export declare class UpdateBookingDto {
    truckId?: string;
    driverId?: string;
    slotStart?: Date;
}
export declare class BookingResponseDto {
    id: string;
    bookingReference: string;
    portId: string;
    terminalId: string;
    carrierId: string;
    truckId: string;
    driverId: string;
    status: BookingStatus;
    slotStart: Date;
    slotEnd: Date;
    slotsCount: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare class BookingWithDetailsDto extends BookingResponseDto {
    truck?: {
        id: string;
        plateNumber: string;
    };
    driver?: {
        id: string;
        user?: {
            fullName: string;
        };
    };
    terminal?: {
        id: string;
        name: string;
    };
}
export declare class CheckAvailabilityDto {
    terminalId: string;
    date: Date;
}
