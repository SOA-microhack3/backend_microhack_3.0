import { UserRole } from '../../../common/enums';
import { Operator } from '../../operators/entities/operator.entity';
import { Carrier } from '../../carriers/entities/carrier.entity';
import { Driver } from '../../drivers/entities/driver.entity';
import { Notification } from '../../notifications/entities/notification.entity';
export declare class User {
    id: string;
    fullName: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    refreshToken: string | null;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date | null;
    createdAt: Date;
    operator: Operator;
    carrier: Carrier;
    driver: Driver;
    notifications: Notification[];
}
