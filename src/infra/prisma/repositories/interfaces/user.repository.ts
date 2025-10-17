export type RoleType = "ADMIN" | "USER" | "PROVIDER" | "BUYER";

export type UserStatus = "ACTIVE" | "INACTIVE" | "PENDING";

export interface UserProps {
    id: string;
    email: string;
    fullName: string;
    password: string;
    phone: string;
    status: UserStatus;
    createdAt: Date;
}

export interface CreateUserParams {
    user: {
        email: string;
        password: string;
        fullName: string;
        phone: string;
    };
}

export interface UpdateUserParams {
    userId: string;
    body: {
        fullName?: string;
        phone?: string;
        sector?: string;
    };
}

export interface UpdatePasswordParams {
    userId: string;
    password: string;
}

export abstract class UserRepository {
    abstract create(
        params: CreateUserParams,
    ): Promise<
        Pick<
            UserProps,
            | "id"
            | "email"
            | "fullName"
            | "phone"
            | "createdAt"
            | "password"
            | "status"
        >
    >;

    abstract findByEmail(email: string): Promise<UserProps | null>;

    abstract findById(id: string): Promise<UserProps | null>;

    abstract update(params: UpdateUserParams): Promise<void>;

    abstract delete(id: string): Promise<void>;

    abstract updateStatus(userId: string): Promise<void>;

    abstract updatePassword(params: UpdatePasswordParams): Promise<void>;
}
