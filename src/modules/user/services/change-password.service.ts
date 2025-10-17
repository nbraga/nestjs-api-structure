import { BcryptServiceProps } from "@/common/interfaces/bcrypt-service-props";
import { PrismaUserRepository } from "@/infra/prisma/repositories/prisma-user.repository";
import { Injectable } from "@nestjs/common";
import {
    ChangePasswordErrors,
    ChangePasswordParams,
    ChangePasswordResponse,
    ChangePasswordUseCase,
} from "../use-cases/change-password.use-case";

@Injectable()
export class ChangePasswordService implements ChangePasswordUseCase {
    constructor(
        private readonly prismaUserRepository: PrismaUserRepository,
        private readonly bcryptService: BcryptServiceProps,
    ) {}

    async execute({
        userId,
        body,
    }: ChangePasswordParams): Promise<
        | { status: "success"; data: ChangePasswordResponse }
        | { status: "error"; error: ChangePasswordErrors }
    > {
        const user = await this.prismaUserRepository.findById(userId);

        if (!user) {
            return {
                status: "error",
                error: "Usuário não encontrado",
            };
        }

        const isPasswordValid = await this.bcryptService.compare(
            body.oldPassword,
            user.password,
        );

        if (!isPasswordValid) {
            return {
                status: "error",
                error: "Senha inválida",
            };
        }

        const hashedPassword = await this.bcryptService.hash(body.newPassword);

        await this.prismaUserRepository.updatePassword({
            userId,
            password: hashedPassword,
        });

        return {
            status: "success",
            data: null,
        };
    }
}
