import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export interface CreateUserParams {
    user: {
        email: string;
        password: string;
        fullName: string;
        phone: string;
    };
    company: {
        cnpj: string;
        tradeName: string;
        socialName: string;
    };
    roles: string[];
}

export type CreateUserResponse = {
    token: string;
};

export type CreateUserErrors =
    | "Email já está em uso"
    | "CNPJ já está em uso"
    | "Empresa não encontrada";

export type CreateUserUseCase = ServiceResponseProps<
    CreateUserParams,
    CreateUserErrors,
    CreateUserResponse
>;
