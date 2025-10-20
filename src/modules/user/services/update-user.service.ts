import { UserRepository } from "@/infra/prisma/repositories/interfaces/user.repository";
import { Injectable } from "@nestjs/common";
import {
    UpdateUserErrors,
    UpdateUserParams,
    UpdateUserResponse,
    UpdateUserUseCase,
} from "../use-cases/update-user.use-case";

@Injectable()
export class UpdateUserService implements UpdateUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute({
        userId,
        body,
    }: UpdateUserParams): Promise<
        | { status: "success"; data: UpdateUserResponse }
        | { status: "error"; error: UpdateUserErrors }
    > {
        const user = await this.userRepository.findById(userId);

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

        await this.userRepository.update({
            userId,
            body,
        });

        return {
            status: "success",
            data: null,
        };
    }
}
