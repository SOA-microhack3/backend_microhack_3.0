import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../modules/users/users.service';
import { UserRole } from '../common/enums';

@Injectable()
export class AdminSeedService implements OnModuleInit {
  private readonly logger = new Logger(AdminSeedService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    const shouldSeed = this.configService.get<boolean>('admin.seed');
    if (shouldSeed === false) {
      return;
    }

    const existingAdmins = await this.usersService.findAll(UserRole.ADMIN);
    if (existingAdmins.length > 0) {
      return;
    }

    const email =
      this.configService.get<string>('admin.email') || 'admin@portflow.ma';
    const password =
      this.configService.get<string>('admin.password') || 'demo123';
    const fullName =
      this.configService.get<string>('admin.fullName') || 'Port Admin';

    const existingByEmail = await this.usersService.findByEmail(email);
    if (existingByEmail) {
      if (existingByEmail.role !== UserRole.ADMIN) {
        this.logger.warn(
          `User with email ${email} exists but is not ADMIN. Skipping admin seed.`,
        );
      }
      return;
    }

    await this.usersService.create({
      fullName,
      email,
      password,
      role: UserRole.ADMIN,
    });

    this.logger.log(`Seeded default admin: ${email}`);
  }
}
