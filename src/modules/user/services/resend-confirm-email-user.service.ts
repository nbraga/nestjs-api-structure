import { EnvService } from "@/infra/env/env.service";
import { InvitationConfirmEmailUserService } from "@/infra/mail/services/invitation-confirm-email-user.service";
import { UserRepository } from "@/infra/prisma/repositories/interfaces/user.repository";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
    ResendConfirmEmailUserErrors,
    ResendConfirmEmailUserParams,
    ResendConfirmEmailUserResponse,
    ResendConfirmEmailUserUseCase,
} from "../use-cases/resend-confirm-email-user.use-case";

@Injectable()
export class ResendConfirmEmailUserService
    implements ResendConfirmEmailUserUseCase
{
    constructor(
        private readonly userRepository: UserRepository,
        private readonly invitationConfirmEmailUserService: InvitationConfirmEmailUserService,
        private readonly jwtService: JwtService,
        private readonly envService: EnvService,
    ) {}

    async execute(
        userId: ResendConfirmEmailUserParams,
    ): Promise<
        | { status: "success"; data: ResendConfirmEmailUserResponse }
        | { status: "error"; error: ResendConfirmEmailUserErrors }
    > {
        const user = await this.userRepository.findById(userId);

        if (!user) {
            return {
                status: "error",
                error: "Usuário não encontrado",
            };
        }

        if (user.status === "ACTIVE") {
            return {
                status: "error",
                error: "Usuário já está ativo",
            };
        }

        const confirmationEmailToken = await this.jwtService.signAsync(
            {
                id: user.id,
                email: user.email,
            },
            {
                expiresIn: "1d",
            },
        );

        await this.invitationConfirmEmailUserService.send({
            link: `${this.envService.get("FRONTEND_URL")}/confirm-email?token=${confirmationEmailToken}`,
            name: user.fullName,
            to: user.email,
        });

        return {
            status: "success",
            data: null,
        };
    }
}
