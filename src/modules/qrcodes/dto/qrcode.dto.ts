import { IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ScanQrCodeDto {
    @ApiProperty({ description: 'JWT token from QR code' })
    @IsString()
    token: string;
}

export class QrCodeResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    bookingId: string;

    @ApiProperty()
    jwtToken: string;

    @ApiProperty()
    qrCodeData: string;

    @ApiProperty()
    expiresAt: Date;

    @ApiPropertyOptional()
    usedAt?: Date;

    @ApiPropertyOptional()
    pathId?: string;

    @ApiProperty()
    createdAt: Date;
}

export class QrValidationResultDto {
    @ApiProperty()
    valid: boolean;

    @ApiProperty()
    message: string;

    @ApiPropertyOptional()
    booking?: {
        id: string;
        bookingReference: string;
        truckPlate: string;
        driverName: string;
        slotStart: Date;
        slotEnd: Date;
        terminalName: string;
    };
}
