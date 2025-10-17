import { ROLES_KEY, UserRoles } from "@/common/decorators/roles.decorator";
import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRoles = this.reflector.getAllAndOverride<UserRoles[]>(
            ROLES_KEY,
            [context.getHandler(), context.getClass()],
        );

        if (!Array.isArray(requiredRoles) || requiredRoles.length === 0) {
            return true;
        }

        const request = context
            .switchToHttp()
            .getRequest<{ user?: { roles?: string[] } }>();
        const user = request?.user;

        if (!user || !Array.isArray(user.roles)) {
            return false;
        }

        // SUPER_ADMIN has access to everything
        if (user.roles.includes("SUPER_ADMIN")) {
            return true;
        }

        const hasRole = user.roles.some((role: UserRoles) =>
            requiredRoles.includes(role),
        );

        if (!hasRole) {
            throw new UnauthorizedException("Usuário não autorizado");
        }

        return true;
    }
}
