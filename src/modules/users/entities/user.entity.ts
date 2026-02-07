import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
    OneToMany,
} from 'typeorm';
import { UserRole } from '../../../common/enums';
import { Operator } from '../../operators/entities/operator.entity';
import { Carrier } from '../../carriers/entities/carrier.entity';
import { Driver } from '../../drivers/entities/driver.entity';
import { Notification } from '../../notifications/entities/notification.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'full_name' })
    fullName: string;

    @Column({ unique: true })
    email: string;

    @Column({ name: 'password_hash' })
    passwordHash: string;

    @Column({
        type: 'enum',
        enum: UserRole,
        default: UserRole.DRIVER,
    })
    role: UserRole;

    @Column({ name: 'refresh_token', type: 'varchar', nullable: true })
    refreshToken: string | null;

    @Column({ name: 'reset_password_token', type: 'varchar', nullable: true })
    resetPasswordToken: string | null;

    @Column({ name: 'reset_password_expires', type: 'timestamp', nullable: true })
    resetPasswordExpires: Date | null;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToOne(() => Operator, (operator) => operator.user)
    operator: Operator;

    @OneToOne(() => Carrier, (carrier) => carrier.user)
    carrier: Carrier;

    @OneToOne(() => Driver, (driver) => driver.user)
    driver: Driver;

    @OneToMany(() => Notification, (notification) => notification.user)
    notifications: Notification[];
}
