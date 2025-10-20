import { BcryptServiceProps } from "@/common/interfaces/bcrypt-service-props";
import { EnvService } from "@/infra/env/env.service";
import { UserRepository } from "@/infra/prisma/repositories/interfaces/user.repository";
import {
    ResetPasswordErrors,
    ResetPasswordParams,
    ResetPasswordResponse,
    ResetPasswordUseCase,
} from "@/modules/user/use-cases/reset-password.use-case";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class ResetPasswordService implements ResetPasswordUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly envService: EnvService,
        private readonly bcryptService: BcryptServiceProps,
    ) {}

    async execute({
        token,
        password,
    }: ResetPasswordParams): Promise<
        | { status: "success"; data: ResetPasswordResponse }
        | { status: "error"; error: ResetPasswordErrors }
    > {
        const jwtSecret = this.envService.get("JWT_SECRET");

        const payload = await this.jwtService.verifyAsync<{ email: string }>(
            token,
            {
                secret: jwtSecret,
            },
        );

        if (!payload) {
            return {
                status: "error",
                error: "Token inválido",
            };
        }

        const email = payload.email;

        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            return {
                status: "error",
                error: "Usuário não encontrado",
            };
        }

        const hashedPassword = await this.bcryptService.hash(password);

        await this.userRepository.updatePassword({
            userId: user.id,
            password: hashedPassword,
        });

        return {
            status: "success",
            data: { message: "Senha resetada com sucesso" },
        };
    }
}
