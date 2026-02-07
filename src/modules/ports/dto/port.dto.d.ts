export declare class CreatePortDto {
    name: string;
    countryCode: string;
    timezone?: string;
    slotDuration?: number;
}
export declare class UpdatePortDto {
    name?: string;
    timezone?: string;
    slotDuration?: number;
}
export declare class PortResponseDto {
    id: string;
    name: string;
    countryCode: string;
    timezone: string;
    slotDuration: number;
    createdAt: Date;
}
