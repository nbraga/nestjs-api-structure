import type { UserProps } from "@/common/interfaces/user-props";
import { PrismaService } from "@/infra/prisma/prisma.service";
import {
    type CreateUserParams,
    type UpdatePasswordParams,
    type UpdateUserParams,
    UserRepository,
} from "@/infra/prisma/repositories/interfaces/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaUserRepository extends UserRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async create(params: CreateUserParams): Promise<UserProps | null> {
        const result = await this.prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email: params.user.email,
                    password: params.user.password,
                    fullName: params.user.fullName,
                    phone: params.user.phone,
                },
            });

            return user;
        });

        return result;
    }

    async findByEmail(email: string): Promise<UserProps | null> {
        const user = await this.prisma.user.findUnique({
            where: { email, deletedAt: null },
        });

        if (!user) {
            return null;
        }

        const { ...userWithoutUserRoleCompany } = user;

        return {
            ...userWithoutUserRoleCompany,
        };
    }

    async findById(id: string): Promise<UserProps | null> {
        const user = await this.prisma.user.findUnique({
            where: { id, deletedAt: null },
        });

        if (!user) {
            return null;
        }

        return user;
    }

    async update(params: UpdateUserParams): Promise<void> {
        const { userId, body } = params;
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                fullName: body.fullName,
                phone: body.phone,
            },
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async updateStatus(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                status: "ACTIVE",
            },
        });
    }

    async updatePassword(params: UpdatePasswordParams): Promise<void> {
        const { userId, password } = params;
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password,
            },
        });
    }
}
