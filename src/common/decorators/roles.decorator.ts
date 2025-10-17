import type { RoleType } from "@/infra/prisma/repositories/interfaces/user.repository";
import { SetMetadata } from "@nestjs/common";

export type UserRoles = RoleType;

export const ROLES_KEY = "roles";

export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
