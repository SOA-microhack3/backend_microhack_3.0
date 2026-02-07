import { UserRole } from '../../../common/enums';
export declare class CreateUserDto {
    fullName: string;
    email: string;
    password: string;
    role: UserRole;
}
export declare class UpdateUserDto {
    fullName?: string;
    email?: string;
    role?: UserRole;
}
export declare class UserResponseDto {
    id: string;
    fullName: string;
    email: string;
    role: UserRole;
    createdAt: Date;
}
