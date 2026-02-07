import { UsersService } from '../users/users.service';
import { BookingsService } from '../bookings/bookings.service';
import { CarriersService } from '../carriers/carriers.service';
import { OperatorsService } from '../operators/operators.service';
import { TerminalsService } from '../terminals/terminals.service';
import { UserRole } from '../../common/enums';
type RequestUser = {
    id: string;
    email: string;
    role: UserRole | string;
};
export declare class AiAgentService {
    private readonly usersService;
    private readonly bookingsService;
    private readonly carriersService;
    private readonly operatorsService;
    private readonly terminalsService;
    constructor(usersService: UsersService, bookingsService: BookingsService, carriersService: CarriersService, operatorsService: OperatorsService, terminalsService: TerminalsService);
    chat(input: {
        message: string;
        user: RequestUser | null | undefined;
    }): Promise<string>;
    private buildSystemPrompt;
    private buildTools;
}
export {};
