import { UserRepository } from "@/infra/prisma/repositories/interfaces/user.repository";
import { Injectable } from "@nestjs/common";
import {
    FindMeErrors,
    FindMeParams,
    FindMeResponse,
    FindMeUseCase,
} from "../use-cases/find-me.use-case";

@Injectable()
export class FindMeService implements FindMeUseCase {
    constructor(private readonly userRepository: UserRepository) {}

    async execute({
        userId,
    }: FindMeParams): Promise<
        | { status: "success"; data: FindMeResponse }
        | { status: "error"; error: FindMeErrors }
    > {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            return {
                status: "error",
                error: "Usuário não encontrado",
            };
        }

        const { password: _, ...userWithoutPassword } = user;

        return {
            status: "success",
            data: {
                ...userWithoutPassword,
            },
        };
    }
}
