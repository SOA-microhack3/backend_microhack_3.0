import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ChatDto {
    @ApiProperty({ example: 'Show me my pending bookings for tomorrow.' })
    @IsString()
    @MinLength(1)
    message: string;
}
