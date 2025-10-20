import { EnvService } from "@/infra/env/env.service";
import { RecoveryPasswordEmailService } from "@/infra/mail/services/recovery-password-email.service";
import { UserRepository } from "@/infra/prisma/repositories/interfaces/user.repository";
import {
    RecoveryPasswordErrors,
    RecoveryPasswordParams,
    RecoveryPasswordResponse,
    RecoveryPasswordUseCase,
} from "@/modules/user/use-cases/recovery-password.use-case";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

@Injectable()
export class RecoveryPasswordService implements RecoveryPasswordUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly recoveryPasswordEmailService: RecoveryPasswordEmailService,
        private readonly jwtService: JwtService,
        private readonly envService: EnvService,
    ) {}

    async execute({
        email,
    }: RecoveryPasswordParams): Promise<
        | { status: "success"; data: RecoveryPasswordResponse }
        | { status: "error"; error: RecoveryPasswordErrors }
    > {
        const user = await this.userRepository.findByEmail(email);

        if (!user) {
            return {
                status: "error",
                error: "Usuário não encontrado",
            };
        }

        const token = await this.jwtService.signAsync({
            email,
        });

        const frontendUrl = this.envService.get("FRONTEND_URL");

        const link = `${frontendUrl}/recovery-password?token=${token}`;

        await this.recoveryPasswordEmailService.send({
            link,
            name: user.fullName,
            to: user.email,
        });

        return {
            status: "success",
            data: null,
        };
    }
}
