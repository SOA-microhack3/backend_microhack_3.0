import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    OneToOne,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { OperatorStatus } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';
import { Port } from '../../ports/entities/port.entity';
import { Terminal } from '../../terminals/entities/terminal.entity';

@Entity('operators')
export class Operator {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'user_id' })
    userId: string;

    @OneToOne(() => User, (user) => user.operator)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({
        type: 'enum',
        enum: OperatorStatus,
        default: OperatorStatus.ACTIVE,
    })
    status: OperatorStatus;

    @Column({ name: 'port_id' })
    portId: string;

    @ManyToOne(() => Port, (port) => port.operators)
    @JoinColumn({ name: 'port_id' })
    port: Port;

    @Column({ name: 'terminal_id' })
    terminalId: string;

    @ManyToOne(() => Terminal, (terminal) => terminal.operators)
    @JoinColumn({ name: 'terminal_id' })
    terminal: Terminal;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;
}
