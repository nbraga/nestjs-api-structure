import { PrismaUserRepository } from "@/infra/prisma/repositories/prisma-user.repository";
import { Injectable } from "@nestjs/common";
import {
    ConfirmEmailUserErrors,
    ConfirmEmailUserParams,
    ConfirmEmailUserResponse,
    ConfirmEmailUserUseCase,
} from "../use-cases/confirm-email-user.use-case";

@Injectable()
export class ConfirmEmailUserService implements ConfirmEmailUserUseCase {
    constructor(private readonly prismaUserRepository: PrismaUserRepository) {}

    async execute(
        userId: ConfirmEmailUserParams,
    ): Promise<
        | { status: "success"; data: ConfirmEmailUserResponse }
        | { status: "error"; error: ConfirmEmailUserErrors }
    > {
        const user = await this.prismaUserRepository.findById(userId);

        if (!user) {
            return {
                status: "error",
                error: "Usuário não encontrado",
            };
        }

        await this.prismaUserRepository.updateStatus(userId);

        return {
            status: "success",
            data: null,
        };
    }
}
