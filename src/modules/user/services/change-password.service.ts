import { BcryptServiceProps } from "@/common/interfaces/bcrypt-service-props";
import { UserRepository } from "@/infra/prisma/repositories/interfaces/user.repository";
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
        private readonly userRepository: UserRepository,
        private readonly bcryptService: BcryptServiceProps,
    ) {}

    async execute({
        userId,
        body,
    }: ChangePasswordParams): Promise<
        | { status: "success"; data: ChangePasswordResponse }
        | { status: "error"; error: ChangePasswordErrors }
    > {
        const user = await this.userRepository.findById(userId);

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

        await this.userRepository.updatePassword({
            userId,
            password: hashedPassword,
        });

        return {
            status: "success",
            data: null,
        };
    }
}
