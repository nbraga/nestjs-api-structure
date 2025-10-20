import { BcryptServiceProps } from "@/common/interfaces/bcrypt-service-props";
import { UserRepository } from "@/infra/prisma/repositories/interfaces/user.repository";
import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import {
    LoginErrors,
    LoginParams,
    LoginResponse,
    LoginUseCase,
} from "../use-cases/login.use-case";

@Injectable()
export class LoginService implements LoginUseCase {
    constructor(
        private readonly userRepository: UserRepository,
        private readonly jwtService: JwtService,
        private readonly bcryptService: BcryptServiceProps,
    ) {}

    async execute({
        body,
    }: LoginParams): Promise<
        | { status: "success"; data: LoginResponse }
        | { status: "error"; error: LoginErrors }
    > {
        const user = await this.userRepository.findByEmail(body.email);

        if (!user) {
            return {
                status: "error",
                error: "Email ou senha inválidos",
            };
        }

        const isMatchPassword = await this.bcryptService.compare(
            body.password,
            user.password ?? "",
        );

        if (!isMatchPassword) {
            return {
                status: "error",
                error: "Email ou senha inválidos",
            };
        }

        const { password, ...userWithoutPassword } = user;

        const token = await this.jwtService.signAsync({
            id: user.id,
            email: user.email,
        });

        return {
            status: "success",
            data: { user: userWithoutPassword, token },
        };
    }
}
