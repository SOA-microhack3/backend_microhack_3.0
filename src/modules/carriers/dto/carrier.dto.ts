import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCarrierDto {
    @ApiProperty({ example: 'ABC Logistics' })
    @IsString()
    @IsNotEmpty()
    name: string;

    @ApiProperty({ description: 'User ID to associate with carrier' })
    @IsUUID()
    userId: string;
}

export class UpdateCarrierDto {
    @ApiPropertyOptional({ example: 'ABC Logistics' })
    @IsString()
    @IsOptional()
    name?: string;
}

export class CarrierResponseDto {
    @ApiProperty()
    id: string;

    @ApiProperty()
    name: string;

    @ApiProperty()
    userId: string;

    @ApiProperty()
    createdAt: Date;
}
