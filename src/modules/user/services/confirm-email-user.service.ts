import { UserRepository } from "@/infra/prisma/repositories/interfaces/user.repository";
import { Injectable } from "@nestjs/common";
import {
    ConfirmEmailUserErrors,
    ConfirmEmailUserParams,
    ConfirmEmailUserResponse,
    ConfirmEmailUserUseCase,
} from "../use-cases/confirm-email-user.use-case";

@Injectable()
export class ConfirmEmailUserService implements ConfirmEmailUserUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute(
        userId: ConfirmEmailUserParams,
    ): Promise<
        | { status: "success"; data: ConfirmEmailUserResponse }
        | { status: "error"; error: ConfirmEmailUserErrors }
    > {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            return {
                status: "error",
                error: "Usuário não encontrado",
            };
        }

        await this.userRepository.updateStatus(userId);

        return {
            status: "success",
            data: null,
        };
    }
}
