import { PrismaUserRepository } from "@/infra/prisma/repositories/prisma-user.repository";
import { Injectable } from "@nestjs/common";
import {
    UpdateUserErrors,
    UpdateUserParams,
    UpdateUserResponse,
    UpdateUserUseCase,
} from "../use-cases/update-user.use-case";

@Injectable()
export class UpdateUserService implements UpdateUserUseCase {
    constructor(private readonly prismaUserRepository: PrismaUserRepository) {}

    async execute({
        userId,
        body,
    }: UpdateUserParams): Promise<
        | { status: "success"; data: UpdateUserResponse }
        | { status: "error"; error: UpdateUserErrors }
    > {
        const user = await this.prismaUserRepository.findById(userId);

        if (!user) {
            return {
                status: "error",
                error: "Usuário não encontrado",
            };
        }

        if (user.id !== userId) {
            return {
                status: "error",
                error: "Você não pode atualizar o usuário de outra empresa",
            };
        }

        await this.prismaUserRepository.update({
            userId,
            body,
        });

        return {
            status: "success",
            data: null,
        };
    }
}
