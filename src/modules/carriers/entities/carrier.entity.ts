import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Driver } from '../../drivers/entities/driver.entity';
import { Truck } from '../../trucks/entities/truck.entity';
import { Booking } from '../../bookings/entities/booking.entity';

@Entity('carriers')
export class Carrier {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @OneToOne(() => User, (user) => user.carrier)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column()
    name: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @OneToMany(() => Driver, (driver) => driver.carrier)
    drivers: Driver[];

    @OneToMany(() => Truck, (truck) => truck.carrier)
    trucks: Truck[];

    @OneToMany(() => Booking, (booking) => booking.carrier)
    bookings: Booking[];
}
