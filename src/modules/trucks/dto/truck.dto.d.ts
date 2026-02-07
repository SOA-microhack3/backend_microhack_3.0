import { TruckStatus } from '../../../common/enums';
export declare class CreateTruckDto {
    plateNumber: string;
    carrierId: string;
}
export declare class UpdateTruckDto {
    plateNumber?: string;
}
export declare class UpdateTruckStatusDto {
    status: TruckStatus;
}
export declare class TruckResponseDto {
    id: string;
    plateNumber: string;
    carrierId: string;
    status: TruckStatus;
    createdAt: Date;
}
