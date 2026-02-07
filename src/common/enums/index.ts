export enum UserRole {
    ADMIN = 'ADMIN',
    OPERATOR = 'OPERATOR',
    CARRIER = 'CARRIER',
    DRIVER = 'DRIVER',
}

export enum BookingStatus {
    PENDING = 'PENDING',
    CONFIRMED = 'CONFIRMED',
    CANCELLED = 'CANCELLED',
    CONSUMED = 'CONSUMED',
    REJECTED = 'REJECTED',
}

export enum DriverStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
}

export enum TruckStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
}

export enum OperatorStatus {
    ACTIVE = 'ACTIVE',
    SUSPENDED = 'SUSPENDED',
}

export enum ActorType {
    USER = 'USER',
    AI = 'AI',
    SYSTEM = 'SYSTEM',
}

export enum EntityType {
    BOOKING = 'BOOKING',
    TRUCK = 'TRUCK',
    DRIVER = 'DRIVER',
    QR = 'QR',
    TERMINAL = 'TERMINAL',
    CARRIER = 'CARRIER',
}

export enum LogAction {
    CREATED = 'CREATED',
    UPDATED = 'UPDATED',
    CANCELLED = 'CANCELLED',
    CONFIRMED = 'CONFIRMED',
    REJECTED = 'REJECTED',
    CHECKED_IN = 'CHECKED_IN',
    SCANNED = 'SCANNED',
    EXPIRED = 'EXPIRED',
    REALLOCATED = 'REALLOCATED',
    SUGGESTED = 'SUGGESTED',
}

export enum NotificationType {
    EMAIL = 'EMAIL',
    PUSH = 'PUSH',
    SOCKET = 'SOCKET',
}

export enum NotificationSource {
    SYSTEM = 'SYSTEM',
    ADMIN = 'ADMIN',
    CARRIER = 'CARRIER',
}
