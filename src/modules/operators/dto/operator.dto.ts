import { IsEnum, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { OperatorStatus } from '../../../common/enums';

export class CreateOperatorDto {
    @ApiProperty({ description: 'User ID' })
    @IsUUID()
    userId: string;

    @ApiProperty({ description: 'Port ID' })
    @IsUUID()
    portId: string;

    @ApiProperty({ description: 'Terminal ID' })
    @IsUUID()
    terminalId: string;
}

export class UpdateOperatorStatusDto {
    @ApiProperty({ enum: OperatorStatus })
    @IsEnum(OperatorStatus)
    status: OperatorStatus;
}

export class OperatorResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    portId: string;

    @ApiProperty()
    terminalId: string;

    @ApiProperty({ enum: OperatorStatus })
    status: OperatorStatus;

    @ApiProperty()
    createdAt: Date;
}
