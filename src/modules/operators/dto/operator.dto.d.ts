import { OperatorStatus } from '../../../common/enums';
export declare class CreateOperatorDto {
    userId: string;
    portId: string;
    terminalId: string;
}
export declare class UpdateOperatorStatusDto {
    status: OperatorStatus;
}
export declare class OperatorResponseDto {
    id: string;
    userId: string;
    portId: string;
    terminalId: string;
    status: OperatorStatus;
    createdAt: Date;
}
