import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    NotFoundException,
    BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../users/entities/user.entity';
import {
    RegisterDto,
    LoginDto,
    RefreshTokenDto,
    ForgotPasswordDto,
    ResetPasswordDto,
    AuthResponseDto,
} from './dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    async register(registerDto: RegisterDto): Promise<AuthResponseDto> {
        const existingUser = await this.usersRepository.findOne({
            where: { email: registerDto.email },
        });

        if (existingUser) {
            throw new ConflictException('Email already registered');
        }

        const passwordHash = await bcrypt.hash(registerDto.password, 10);

        const user = this.usersRepository.create({
            fullName: registerDto.fullName,
            email: registerDto.email,
            passwordHash,
            role: registerDto.role,
        });

        await this.usersRepository.save(user);

        return this.generateTokens(user);
    }

    async login(loginDto: LoginDto): Promise<AuthResponseDto> {
        const user = await this.usersRepository.findOne({
            where: { email: loginDto.email },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(
            loginDto.password,
            user.passwordHash,
        );

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        return this.generateTokens(user);
    }

    async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<AuthResponseDto> {
        try {
            const payload = this.jwtService.verify(refreshTokenDto.refreshToken, {
                secret: this.configService.get<string>('jwt.secret'),
            });

            const user = await this.usersRepository.findOne({
                where: { id: payload.sub },
            });

            if (!user || user.refreshToken !== refreshTokenDto.refreshToken) {
                throw new UnauthorizedException('Invalid refresh token');
            }

            return this.generateTokens(user);
        } catch {
            throw new UnauthorizedException('Invalid refresh token');
        }
    }

    async logout(userId: string): Promise<void> {
        await this.usersRepository.update(userId, { refreshToken: null });
    }

    async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<{ message: string }> {
        const user = await this.usersRepository.findOne({
            where: { email: forgotPasswordDto.email },
        });

        if (!user) {
            // Don't reveal if email exists
            return { message: 'If the email exists, a reset link has been sent' };
        }

        const resetToken = uuidv4();
        const resetExpires = new Date();
        resetExpires.setHours(resetExpires.getHours() + 1);

        await this.usersRepository.update(user.id, {
            resetPasswordToken: resetToken,
            resetPasswordExpires: resetExpires,
        });

        // TODO: Send email with reset link
        // For now, just return the token (in production, this would be sent via email)
        return { message: 'If the email exists, a reset link has been sent' };
    }

    async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<{ message: string }> {
        const user = await this.usersRepository.findOne({
            where: {
                resetPasswordToken: resetPasswordDto.token,
                resetPasswordExpires: MoreThan(new Date()),
            },
        });

        if (!user) {
            throw new BadRequestException('Invalid or expired reset token');
        }

        const passwordHash = await bcrypt.hash(resetPasswordDto.newPassword, 10);

        await this.usersRepository.update(user.id, {
            passwordHash,
            resetPasswordToken: null,
            resetPasswordExpires: null,
        });

        return { message: 'Password reset successfully' };
    }

    private async generateTokens(user: User): Promise<AuthResponseDto> {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role,
        };

        const accessToken = this.jwtService.sign(payload);
        const refreshToken = this.jwtService.sign(payload, {
            expiresIn: '7d',
        });

        await this.usersRepository.update(user.id, { refreshToken });

        return {
            accessToken,
            refreshToken,
            user: {
                id: user.id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
            },
        };
    }

    async validateUser(userId: string): Promise<User | null> {
        return this.usersRepository.findOne({ where: { id: userId } });
    }
}
