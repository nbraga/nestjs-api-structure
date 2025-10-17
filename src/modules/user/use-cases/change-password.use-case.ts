import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export interface ChangePasswordParams {
    userId: string;
    body: {
        newPassword: string;
        oldPassword: string;
    };
}

export type ChangePasswordResponse = null;

export type ChangePasswordErrors = "Usuário não encontrado" | "Senha inválida";

export type ChangePasswordUseCase = ServiceResponseProps<
    ChangePasswordParams,
    ChangePasswordErrors,
    ChangePasswordResponse
>;
