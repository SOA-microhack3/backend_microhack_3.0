export declare class CreateTerminalDto {
    name: string;
    portId: string;
    maxCapacity: number;
}
export declare class UpdateTerminalDto {
    name?: string;
    maxCapacity?: number;
}
export declare class TerminalResponseDto {
    id: string;
    name: string;
    portId: string;
    maxCapacity: number;
    createdAt: Date;
}
export declare class TerminalCapacityDto {
    terminalId: string;
    terminalName: string;
    maxCapacity: number;
    slots: SlotCapacityDto[];
}
export declare class SlotCapacityDto {
    slotStart: Date;
    slotEnd: Date;
    bookedCount: number;
    availableCount: number;
}
