import { OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../modules/users/users.service';
export declare class AdminSeedService implements OnModuleInit {
    private readonly usersService;
    private readonly configService;
    private readonly logger;
    constructor(usersService: UsersService, configService: ConfigService);
    onModuleInit(): Promise<void>;
}
