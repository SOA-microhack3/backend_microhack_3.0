import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { BookingStatus } from '../../../common/enums';

export class CreateBookingDto {
    @ApiProperty({ description: 'Terminal ID' })
    @IsUUID()
    terminalId: string;

    @ApiPropertyOptional({ description: 'Carrier ID (admin only)' })
    @IsUUID()
    @IsOptional()
    carrierId?: string;

    @ApiProperty({ description: 'Truck ID' })
    @IsUUID()
    truckId: string;

    @ApiProperty({ description: 'Driver ID' })
    @IsUUID()
    driverId: string;

    @ApiProperty({ description: 'Slot start time' })
    @Type(() => Date)
    @IsDate()
    slotStart: Date;

    @ApiPropertyOptional({ description: 'Container matricule/ID' })
    @IsOptional()
    containerMatricule?: string;

    @ApiPropertyOptional({ description: 'Number of consecutive slots', default: 1 })
    @IsNumber()
    @Min(1)
    @IsOptional()
    slotsCount?: number;
}

export class UpdateBookingDto {
    @ApiPropertyOptional({ description: 'Truck ID' })
    @IsUUID()
    @IsOptional()
    truckId?: string;

    @ApiPropertyOptional({ description: 'Driver ID' })
    @IsUUID()
    @IsOptional()
    driverId?: string;

    @ApiPropertyOptional({ description: 'Slot start time' })
    @Type(() => Date)
    @IsDate()
    @IsOptional()
    slotStart?: Date;
}

export class BookingResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    bookingReference: string;

    @ApiProperty()
    portId: string;

    @ApiProperty()
    terminalId: string;

    @ApiProperty()
    carrierId: string;

    @ApiProperty()
    truckId: string;

    @ApiProperty()
    driverId: string;

    @ApiProperty({ enum: BookingStatus })
    status: BookingStatus;

    @ApiProperty()
    slotStart: Date;

    @ApiProperty()
    slotEnd: Date;

    @ApiProperty()
    slotsCount: number;

    @ApiPropertyOptional()
    containerMatricule?: string;

    @ApiProperty()
    createdAt: Date;

    @ApiProperty()
    updatedAt: Date;
}

export class BookingWithDetailsDto extends BookingResponseDto {
    @ApiPropertyOptional()
    truck?: {
        id: string;
        plateNumber: string;
    };

    @ApiPropertyOptional()
    driver?: {
        id: string;
        user?: {
            fullName: string;
        };
    };

    @ApiPropertyOptional()
    terminal?: {
        id: string;
        name: string;
    };
}

export class CheckAvailabilityDto {
    @ApiProperty({ description: 'Terminal ID' })
    @IsUUID()
    terminalId: string;

    @ApiProperty({ description: 'Date to check' })
    @Type(() => Date)
    @IsDate()
    date: Date;
}
