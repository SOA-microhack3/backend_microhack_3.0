import { DriverStatus } from '../../../common/enums';
export declare class CreateDriverDto {
    userId: string;
    carrierId: string;
}
export declare class UpdateDriverStatusDto {
    status: DriverStatus;
}
export declare class DriverResponseDto {
    id: string;
    userId: string;
    carrierId: string;
    status: DriverStatus;
    createdAt: Date;
    user?: {
        id: string;
        fullName: string;
        email: string;
    };
}
