import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class ConfirmBookingDto {
    @ApiProperty({ example: '3f2b1c7a-5c24-4a17-9a70-4d7a8b1b2c3d' })
    @IsString()
    @MinLength(1)
    confirmationId: string;

    @ApiProperty({ example: 'default', required: false })
    @IsOptional()
    @IsString()
    @MinLength(1)
    conversationId?: string;
}
