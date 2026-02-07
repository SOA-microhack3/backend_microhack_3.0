import { IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DriverStatus } from '../../../common/enums';

export class CreateDriverDto {
    @ApiProperty({ description: 'User ID to associate with driver' })
    @IsUUID()
    userId: string;

    @ApiProperty({ description: 'Carrier ID' })
    @IsUUID()
    carrierId: string;
}

export class UpdateDriverStatusDto {
    @ApiProperty({ enum: DriverStatus })
    @IsEnum(DriverStatus)
    status: DriverStatus;
}

export class DriverResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    carrierId: string;

    @ApiProperty({ enum: DriverStatus })
    status: DriverStatus;

    @ApiProperty()
    createdAt: Date;

    @ApiPropertyOptional()
    user?: {
        id: string;
        fullName: string;
        email: string;
    };
}
