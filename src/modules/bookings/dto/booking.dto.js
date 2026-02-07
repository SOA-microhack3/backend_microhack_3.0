"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CheckAvailabilityDto = exports.BookingWithDetailsDto = exports.BookingResponseDto = exports.UpdateBookingDto = exports.CreateBookingDto = void 0;
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const class_transformer_1 = require("class-transformer");
const enums_1 = require("../../../common/enums");
class CreateBookingDto {
    @(0, swagger_1.ApiProperty)({ description: 'Terminal ID' })
    @(0, class_validator_1.IsUUID)()
    terminalId;
    @(0, swagger_1.ApiPropertyOptional)({ description: 'Carrier ID (admin only)' })
    @(0, class_validator_1.IsUUID)()
    @(0, class_validator_1.IsOptional)()
    carrierId;
    @(0, swagger_1.ApiProperty)({ description: 'Truck ID' })
    @(0, class_validator_1.IsUUID)()
    truckId;
    @(0, swagger_1.ApiProperty)({ description: 'Driver ID' })
    @(0, class_validator_1.IsUUID)()
    driverId;
    @(0, swagger_1.ApiProperty)({ description: 'Slot start time' })
    @(0, class_transformer_1.Type)(() => Date)
    @(0, class_validator_1.IsDate)()
    slotStart;
    @(0, swagger_1.ApiPropertyOptional)({ description: 'Number of consecutive slots', default: 1 })
    @(0, class_validator_1.IsNumber)()
    @(0, class_validator_1.Min)(1)
    @(0, class_validator_1.IsOptional)()
    slotsCount;
}
exports.CreateBookingDto = CreateBookingDto;
class UpdateBookingDto {
    @(0, swagger_1.ApiPropertyOptional)({ description: 'Truck ID' })
    @(0, class_validator_1.IsUUID)()
    @(0, class_validator_1.IsOptional)()
    truckId;
    @(0, swagger_1.ApiPropertyOptional)({ description: 'Driver ID' })
    @(0, class_validator_1.IsUUID)()
    @(0, class_validator_1.IsOptional)()
    driverId;
    @(0, swagger_1.ApiPropertyOptional)({ description: 'Slot start time' })
    @(0, class_transformer_1.Type)(() => Date)
    @(0, class_validator_1.IsDate)()
    @(0, class_validator_1.IsOptional)()
    slotStart;
}
exports.UpdateBookingDto = UpdateBookingDto;
class BookingResponseDto {
    @(0, swagger_1.ApiProperty)()
    id;
    @(0, swagger_1.ApiProperty)()
    bookingReference;
    @(0, swagger_1.ApiProperty)()
    portId;
    @(0, swagger_1.ApiProperty)()
    terminalId;
    @(0, swagger_1.ApiProperty)()
    carrierId;
    @(0, swagger_1.ApiProperty)()
    truckId;
    @(0, swagger_1.ApiProperty)()
    driverId;
    @(0, swagger_1.ApiProperty)({ enum: enums_1.BookingStatus })
    status;
    @(0, swagger_1.ApiProperty)()
    slotStart;
    @(0, swagger_1.ApiProperty)()
    slotEnd;
    @(0, swagger_1.ApiProperty)()
    slotsCount;
    @(0, swagger_1.ApiProperty)()
    createdAt;
    @(0, swagger_1.ApiProperty)()
    updatedAt;
}
exports.BookingResponseDto = BookingResponseDto;
class BookingWithDetailsDto extends BookingResponseDto {
    @(0, swagger_1.ApiPropertyOptional)()
    truck;
    @(0, swagger_1.ApiPropertyOptional)()
    driver;
    @(0, swagger_1.ApiPropertyOptional)()
    terminal;
}
exports.BookingWithDetailsDto = BookingWithDetailsDto;
class CheckAvailabilityDto {
    @(0, swagger_1.ApiProperty)({ description: 'Terminal ID' })
    @(0, class_validator_1.IsUUID)()
    terminalId;
    @(0, swagger_1.ApiProperty)({ description: 'Date to check' })
    @(0, class_transformer_1.Type)(() => Date)
    @(0, class_validator_1.IsDate)()
    date;
}
exports.CheckAvailabilityDto = CheckAvailabilityDto;
