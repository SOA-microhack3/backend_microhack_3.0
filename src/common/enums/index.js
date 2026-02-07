"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationSource = exports.NotificationType = exports.LogAction = exports.EntityType = exports.ActorType = exports.OperatorStatus = exports.TruckStatus = exports.DriverStatus = exports.BookingStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["OPERATOR"] = "OPERATOR";
    UserRole["CARRIER"] = "CARRIER";
    UserRole["DRIVER"] = "DRIVER";
})(UserRole || (exports.UserRole = UserRole = {}));
var BookingStatus;
(function (BookingStatus) {
    BookingStatus["PENDING"] = "PENDING";
    BookingStatus["CONFIRMED"] = "CONFIRMED";
    BookingStatus["CANCELLED"] = "CANCELLED";
    BookingStatus["CONSUMED"] = "CONSUMED";
    BookingStatus["REJECTED"] = "REJECTED";
})(BookingStatus || (exports.BookingStatus = BookingStatus = {}));
var DriverStatus;
(function (DriverStatus) {
    DriverStatus["ACTIVE"] = "ACTIVE";
    DriverStatus["SUSPENDED"] = "SUSPENDED";
})(DriverStatus || (exports.DriverStatus = DriverStatus = {}));
var TruckStatus;
(function (TruckStatus) {
    TruckStatus["ACTIVE"] = "ACTIVE";
    TruckStatus["SUSPENDED"] = "SUSPENDED";
})(TruckStatus || (exports.TruckStatus = TruckStatus = {}));
var OperatorStatus;
(function (OperatorStatus) {
    OperatorStatus["ACTIVE"] = "ACTIVE";
    OperatorStatus["SUSPENDED"] = "SUSPENDED";
})(OperatorStatus || (exports.OperatorStatus = OperatorStatus = {}));
var ActorType;
(function (ActorType) {
    ActorType["USER"] = "USER";
    ActorType["AI"] = "AI";
    ActorType["SYSTEM"] = "SYSTEM";
})(ActorType || (exports.ActorType = ActorType = {}));
var EntityType;
(function (EntityType) {
    EntityType["BOOKING"] = "BOOKING";
    EntityType["TRUCK"] = "TRUCK";
    EntityType["DRIVER"] = "DRIVER";
    EntityType["QR"] = "QR";
    EntityType["TERMINAL"] = "TERMINAL";
    EntityType["CARRIER"] = "CARRIER";
})(EntityType || (exports.EntityType = EntityType = {}));
var LogAction;
(function (LogAction) {
    LogAction["CREATED"] = "CREATED";
    LogAction["UPDATED"] = "UPDATED";
    LogAction["CANCELLED"] = "CANCELLED";
    LogAction["CONFIRMED"] = "CONFIRMED";
    LogAction["REJECTED"] = "REJECTED";
    LogAction["CHECKED_IN"] = "CHECKED_IN";
    LogAction["SCANNED"] = "SCANNED";
    LogAction["EXPIRED"] = "EXPIRED";
    LogAction["REALLOCATED"] = "REALLOCATED";
    LogAction["SUGGESTED"] = "SUGGESTED";
})(LogAction || (exports.LogAction = LogAction = {}));
var NotificationType;
(function (NotificationType) {
    NotificationType["EMAIL"] = "EMAIL";
    NotificationType["PUSH"] = "PUSH";
    NotificationType["SOCKET"] = "SOCKET";
})(NotificationType || (exports.NotificationType = NotificationType = {}));
var NotificationSource;
(function (NotificationSource) {
    NotificationSource["SYSTEM"] = "SYSTEM";
    NotificationSource["ADMIN"] = "ADMIN";
    NotificationSource["CARRIER"] = "CARRIER";
})(NotificationSource || (exports.NotificationSource = NotificationSource = {}));
