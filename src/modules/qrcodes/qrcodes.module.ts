import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { QrCodesController } from './qrcodes.controller';
import { QrCodesService } from './qrcodes.service';
import { QrCode } from './entities/qrcode.entity';
import { Booking } from '../bookings/entities/booking.entity';
import { BookingsModule } from '../bookings/bookings.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([QrCode, Booking]),
        JwtModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
                secret: configService.get<string>('jwt.secret'),
            }),
            inject: [ConfigService],
        }),
        forwardRef(() => BookingsModule),
    ],
    controllers: [QrCodesController],
    providers: [QrCodesService],
    exports: [QrCodesService],
})
export class QrCodesModule { }
