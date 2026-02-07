export declare enum UserRole {
    ADMIN = "ADMIN",
    OPERATOR = "OPERATOR",
    CARRIER = "CARRIER",
    DRIVER = "DRIVER"
}
export declare enum BookingStatus {
    PENDING = "PENDING",
    CONFIRMED = "CONFIRMED",
    CANCELLED = "CANCELLED",
    CONSUMED = "CONSUMED",
    REJECTED = "REJECTED"
}
export declare enum DriverStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED"
}
export declare enum TruckStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED"
}
export declare enum OperatorStatus {
    ACTIVE = "ACTIVE",
    SUSPENDED = "SUSPENDED"
}
export declare enum ActorType {
    USER = "USER",
    AI = "AI",
    SYSTEM = "SYSTEM"
}
export declare enum EntityType {
    BOOKING = "BOOKING",
    TRUCK = "TRUCK",
    DRIVER = "DRIVER",
    QR = "QR",
    TERMINAL = "TERMINAL",
    CARRIER = "CARRIER"
}
export declare enum LogAction {
    CREATED = "CREATED",
    UPDATED = "UPDATED",
    CANCELLED = "CANCELLED",
    CONFIRMED = "CONFIRMED",
    REJECTED = "REJECTED",
    CHECKED_IN = "CHECKED_IN",
    SCANNED = "SCANNED",
    EXPIRED = "EXPIRED",
    REALLOCATED = "REALLOCATED",
    SUGGESTED = "SUGGESTED"
}
export declare enum NotificationType {
    EMAIL = "EMAIL",
    PUSH = "PUSH",
    SOCKET = "SOCKET"
}
export declare enum NotificationSource {
    SYSTEM = "SYSTEM",
    ADMIN = "ADMIN",
    CARRIER = "CARRIER"
}
