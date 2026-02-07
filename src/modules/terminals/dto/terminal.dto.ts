import { IsNotEmpty, IsOptional, IsString, IsNumber, IsUUID, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateTerminalDto {
    @ApiProperty({ example: 'Terminal A' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'Port ID' })
    @IsUUID()
    portId: string;

    @ApiProperty({ example: 50, description: 'Max trucks per time slot' })
    @IsNumber()
    @Min(1)
    maxCapacity: number;
}

export class UpdateTerminalDto {
    @ApiPropertyOptional({ example: 'Terminal A' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 50 })
    @IsNumber()
    @Min(1)
    @IsOptional()
    maxCapacity?: number;
}

export class TerminalResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    portId: string;

    @ApiProperty()
    maxCapacity: number;

    @ApiProperty()
    createdAt: Date;
}

export class TerminalCapacityDto {
    @ApiProperty()
    terminalId: string;

    @ApiProperty()
    terminalName: string;

    @ApiProperty()
    maxCapacity: number;

    @ApiProperty()
    slots: SlotCapacityDto[];
}

export class SlotCapacityDto {
    @ApiProperty()
    slotStart: Date;

    @ApiProperty()
    slotEnd: Date;

    @ApiProperty()
    bookedCount: number;

    @ApiProperty()
    availableCount: number;
}
