import { IsNotEmpty, IsOptional, IsString, IsNumber, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePortDto {
    @ApiProperty({ example: 'Port of Algiers' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ example: 'DZ' })
    @IsString()
    @IsNotEmpty()
    countryCode: string;

    @ApiPropertyOptional({ example: 'Africa/Algiers', default: 'UTC' })
    @IsString()
    @IsOptional()
    timezone?: string;

    @ApiPropertyOptional({ example: 60, description: 'Slot duration in minutes' })
    @IsNumber()
    @Min(15)
    @IsOptional()
    slotDuration?: number;
}

export class UpdatePortDto {
    @ApiPropertyOptional({ example: 'Port of Algiers' })
    @IsString()
    @IsOptional()
    name?: string;

    @ApiPropertyOptional({ example: 'Africa/Algiers' })
    @IsString()
    @IsOptional()
    timezone?: string;

    @ApiPropertyOptional({ example: 60 })
    @IsNumber()
    @Min(15)
    @IsOptional()
    slotDuration?: number;
}

export class PortResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    countryCode: string;

    @ApiProperty()
    timezone: string;

    @ApiProperty()
    slotDuration: number;

    @ApiProperty()
    createdAt: Date;
}
