import { OperatorStatus } from '../../../common/enums';
import { User } from '../../users/entities/user.entity';
import { Port } from '../../ports/entities/port.entity';
import { Terminal } from '../../terminals/entities/terminal.entity';
export declare class Operator {
    id: string;
    userId: string;
    user: User;
    status: OperatorStatus;
    portId: string;
    port: Port;
    terminalId: string;
    terminal: Terminal;
    createdAt: Date;
}
