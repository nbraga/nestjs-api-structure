import { SetMetadata } from "@nestjs/common";
import type { RoleType } from "generated/prisma";

export type UserRoles = RoleType;

export const ROLES_KEY = "roles";

export const Roles = (...roles: UserRoles[]) => SetMetadata(ROLES_KEY, roles);
