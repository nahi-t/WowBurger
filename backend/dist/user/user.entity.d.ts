export declare enum UserRole {
    ADMIN = "ADMIN",
    USER = "USER"
}
export declare class User {
    id: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    createdAt: Date;
}
