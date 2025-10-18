import type { UserStatusType } from "generated/prisma";

export interface UserProps {
    id: string;
    email: string;
    fullName: string;
    password: string;
    phone: string;
    status: UserStatusType;
    createdAt: Date;
}
