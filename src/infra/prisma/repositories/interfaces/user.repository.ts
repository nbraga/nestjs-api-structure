import type { UserProps } from "@/common/interfaces/user-props";

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
    abstract create(params: CreateUserParams): Promise<UserProps | null>;

    abstract findByEmail(email: string): Promise<UserProps | null>;

    abstract findById(id: string): Promise<UserProps | null>;

    abstract update(params: UpdateUserParams): Promise<void>;

    abstract delete(id: string): Promise<void>;

    abstract updateStatus(userId: string): Promise<void>;

    abstract updatePassword(params: UpdatePasswordParams): Promise<void>;
}
