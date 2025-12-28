import { Types } from "mongoose";
export declare enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    ADMIN = "ADMIN",
    USER = "USER",
    GUIDE = "GUIDE"
}
export interface IAuthProvider {
    provider: "google" | "credentials";
    providerId: string;
}
export declare enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED"
}
export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: boolean;
    isActive?: IsActive;
    isVerified?: boolean;
    role: Role;
    booking?: Types.ObjectId[];
    guides?: Types.ObjectId[];
    auths: IAuthProvider[];
    createdAt?: Date;
}
//# sourceMappingURL=user.interface.d.ts.map