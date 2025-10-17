import type { AddressProps } from "@/common/interfaces/address-props";
import type { AreaOfInterestProps } from "@/common/interfaces/area-of-interest-props";
import { PrismaService } from "@/infra/prisma/prisma.service";
import {
    type CreateUserParams,
    type UpdatePasswordParams,
    type UpdateUserParams,
    type UserProps,
    UserRepository,
} from "@/infra/prisma/repositories/interfaces/user.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class PrismaUserRepository extends UserRepository {
    constructor(private readonly prisma: PrismaService) {
        super();
    }

    async create(
        params: CreateUserParams,
    ): Promise<
        Pick<
            UserProps,
            | "id"
            | "email"
            | "fullName"
            | "phone"
            | "createdAt"
            | "password"
            | "status"
        >
    > {
        const result = await this.prisma.$transaction(async (prisma) => {
            const user = await prisma.user.create({
                data: {
                    email: params.user.email,
                    password: params.user.password,
                    fullName: params.user.fullName,
                    phone: params.user.phone,
                },
            });

            return user;
        });

        return result;
    }

    async findByEmail(email: string): Promise<UserProps | null> {
        const user = await this.prisma.user.findUnique({
            where: { email, deletedAt: null },
            include: {
                UserRoleCompany: {
                    select: {
                        role: true,
                        company: {
                            select: {
                                id: true,
                                tradeName: true,
                                socialName: true,
                                cnpj: true,
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            return null;
        }

        const { UserRoleCompany, ...userWithoutUserRoleCompany } = user;

        // Agrupar empresas por id e acumular roles
        const companiesMap = new Map();
        UserRoleCompany.forEach((item) => {
            const companyId = item.company.id;
            if (!companiesMap.has(companyId)) {
                companiesMap.set(companyId, {
                    id: item.company.id,
                    tradeName: item.company.tradeName,
                    socialName: item.company.socialName,
                    cnpj: item.company.cnpj,
                    roles: [item.role],
                });
            } else {
                const company = companiesMap.get(companyId) as {
                    id: string;
                    tradeName: string;
                    socialName: string;
                    cnpj: string;
                    roles: string[];
                };
                company.roles.push(item.role);
            }
        });

        return {
            ...userWithoutUserRoleCompany,
            companies: Array.from(companiesMap.values()) as {
                id: string;
                phone: "";
                municipalRegistration: "";
                stateRegistration: "";
                tradeName: string;
                socialName: string;
                cnpj: string;
                roles: string[];
            }[],
        };
    }

    async findById(id: string): Promise<UserProps | null> {
        const user = await this.prisma.user.findUnique({
            where: { id, deletedAt: null },
            include: {
                UserRoleCompany: {
                    select: {
                        role: true,
                        company: {
                            select: {
                                id: true,
                                tradeName: true,
                                socialName: true,
                                cnpj: true,
                                phone: true,
                                municipalRegistration: true,
                                stateRegistration: true,
                                CompanyAddresses: {
                                    include: {
                                        address: true,
                                    },
                                },
                                CompanyAreasOfInterest: {
                                    include: {
                                        areaOfInterest: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            return null;
        }

        const { UserRoleCompany, ...userWithoutUserRoleCompany } = user;

        // Agrupar empresas por id e acumular roles
        const companiesMap = new Map();
        UserRoleCompany.forEach((item) => {
            const companyId = item.company.id;
            if (!companiesMap.has(companyId)) {
                companiesMap.set(companyId, {
                    id: item.company.id,
                    tradeName: item.company.tradeName,
                    socialName: item.company.socialName,
                    cnpj: item.company.cnpj,
                    roles: [item.role],
                    addresses: item.company.CompanyAddresses.map(
                        (item) => item.address,
                    ),
                    phone: item.company.phone,
                    municipalRegistration: item.company.municipalRegistration,
                    stateRegistration: item.company.stateRegistration,
                    areasOfInterest: item.company.CompanyAreasOfInterest
                        ? item.company.CompanyAreasOfInterest.map((item) => ({
                              id: item.areaOfInterest.id,
                              name: item.areaOfInterest.name,
                          }))
                        : [],
                });
            } else {
                const company = companiesMap.get(companyId) as {
                    id: string;
                    tradeName: string;
                    socialName: string;
                    cnpj: string;
                    roles: string[];
                    addresses: AddressProps[];
                    phone: string;
                    municipalRegistration: string;
                    stateRegistration: string;
                    areasOfInterest: AreaOfInterestProps[];
                };
                company.roles.push(item.role);
            }
        });

        return {
            id: userWithoutUserRoleCompany.id,
            email: userWithoutUserRoleCompany.email,
            fullName: userWithoutUserRoleCompany.fullName,
            password: userWithoutUserRoleCompany.password,
            phone: userWithoutUserRoleCompany.phone,
            status: userWithoutUserRoleCompany.status,
            createdAt: userWithoutUserRoleCompany.createdAt,
        };
    }

    async update(params: UpdateUserParams): Promise<void> {
        const { userId, body } = params;
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                fullName: body.fullName,
                phone: body.phone,
                sector: body.sector,
            },
        });
    }

    async delete(id: string): Promise<void> {
        await this.prisma.user.update({
            where: { id },
            data: {
                deletedAt: new Date(),
            },
        });
    }

    async updateStatus(userId: string): Promise<void> {
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                status: "ACTIVE",
            },
        });
    }

    async updatePassword(params: UpdatePasswordParams): Promise<void> {
        const { userId, password } = params;
        await this.prisma.user.update({
            where: { id: userId },
            data: {
                password,
            },
        });
    }
}
