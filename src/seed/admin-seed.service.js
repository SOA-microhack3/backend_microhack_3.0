"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminSeedService = void 0;
const common_1 = require("@nestjs/common");
const enums_1 = require("../common/enums");
@(0, common_1.Injectable)()
class AdminSeedService {
    usersService;
    configService;
    logger = new common_1.Logger(AdminSeedService.name);
    constructor(usersService, configService) {
        this.usersService = usersService;
        this.configService = configService;
    }
    async onModuleInit() {
        const shouldSeed = this.configService.get('admin.seed');
        if (shouldSeed === false) {
            return;
        }
        const existingAdmins = await this.usersService.findAll(enums_1.UserRole.ADMIN);
        if (existingAdmins.length > 0) {
            return;
        }
        const email = this.configService.get('admin.email') || 'admin@portflow.ma';
        const password = this.configService.get('admin.password') || 'demo123';
        const fullName = this.configService.get('admin.fullName') || 'Port Admin';
        const existingByEmail = await this.usersService.findByEmail(email);
        if (existingByEmail) {
            if (existingByEmail.role !== enums_1.UserRole.ADMIN) {
                this.logger.warn(`User with email ${email} exists but is not ADMIN. Skipping admin seed.`);
            }
            return;
        }
        await this.usersService.create({
            fullName,
            email,
            password,
            role: enums_1.UserRole.ADMIN,
        });
        this.logger.log(`Seeded default admin: ${email}`);
    }
}
exports.AdminSeedService = AdminSeedService;
