import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export type UpdateUserParams = {
    userId: string;
    body: {
        fullName: string;
        phone: string;
        sector: string;
    };
};

export type UpdateUserResponse = null;

export type UpdateUserErrors =
    | "Usuário não encontrado"
    | "Você não pode atualizar o usuário de outra empresa";

export type UpdateUserUseCase = ServiceResponseProps<
    UpdateUserParams,
    UpdateUserErrors,
    UpdateUserResponse
>;
