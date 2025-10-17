import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

import { NO_COMPANY_ID_REQUIRED_KEY } from "@/common/decorators/no-company-id-required.decorator";
import { IS_PUBLIC_KEY } from "@/common/decorators/public.decorator";
import { UserPayloadProps } from "@/common/interfaces/user-payload-props";
import { PrismaUserRepository } from "@/infra/prisma/repositories/prisma-user.repository";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private jwtService: JwtService,
        private reflector: Reflector,
        private userRepository: PrismaUserRepository,
    ) {}

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request: Request = context.switchToHttp().getRequest();
        const isPublic = this.reflector.getAllAndOverride<boolean>(
            IS_PUBLIC_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (isPublic) {
            return true;
        }

        const token = request.headers.authorization?.split(" ")[1];

        if (!token) {
            throw new UnauthorizedException("Token not found");
        }

        try {
            const payload: UserPayloadProps =
                await this.jwtService.verifyAsync(token);

            const user = await this.userRepository.findById(payload.id);

            if (!user) {
                throw new UnauthorizedException("User not found");
            }

            const noCompanyIdRequired =
                this.reflector.getAllAndOverride<boolean>(
                    NO_COMPANY_ID_REQUIRED_KEY,
                    [context.getHandler(), context.getClass()],
                );

            const currentCompanyId = request.query.companyId as string;

            // For non-SUPER_ADMIN users, apply normal company validation
            if (!noCompanyIdRequired && !currentCompanyId) {
                throw new UnauthorizedException("Company ID not found");
            }

            if (noCompanyIdRequired) {
                request["user"] = {
                    id: user.id,
                    email: user.email,
                    roles: [],
                };
            } else {
                request["user"] = {
                    id: user.id,
                    email: user.email,
                };
            }
        } catch (err) {
            throw new UnauthorizedException(
                err instanceof Error ? err.message : "Authentication failed",
            );
        }

        return true;
    }
}
