import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TruckStatus } from '../../../common/enums';

export class CreateTruckDto {
    @ApiProperty({ example: 'ABC-1234' })
    @IsString()
    @IsNotEmpty()
    plateNumber: string;

    @ApiProperty({ description: 'Carrier ID' })
    @IsUUID()
    carrierId: string;
}

export class UpdateTruckDto {
    @ApiPropertyOptional({ example: 'ABC-1234' })
    @IsString()
    @IsOptional()
    plateNumber?: string;
}

export class UpdateTruckStatusDto {
    @ApiProperty({ enum: TruckStatus })
    @IsEnum(TruckStatus)
    status: TruckStatus;
}

export class TruckResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    plateNumber: string;

    @ApiProperty()
    carrierId: string;

    @ApiProperty({ enum: TruckStatus })
    status: TruckStatus;

    @ApiProperty()
    createdAt: Date;
}
