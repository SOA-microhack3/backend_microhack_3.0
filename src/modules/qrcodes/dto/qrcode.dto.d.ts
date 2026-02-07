export declare class ScanQrCodeDto {
    token: string;
}
export declare class QrCodeResponseDto {
    id: string;
    bookingId: string;
    jwtToken: string;
    qrCodeData: string;
    expiresAt: Date;
    usedAt?: Date;
    pathId?: string;
    createdAt: Date;
}
export declare class QrValidationResultDto {
    valid: boolean;
    message: string;
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
