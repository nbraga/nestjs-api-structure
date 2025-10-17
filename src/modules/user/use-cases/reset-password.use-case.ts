import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export interface ResetPasswordParams {
    token: string;
    password: string;
}

export interface ResetPasswordResponse {
    message: string;
}

export type ResetPasswordErrors =
    | "Token inválido"
    | "Erro ao resetar senha"
    | "Usuário não encontrado";

export type ResetPasswordUseCase = ServiceResponseProps<
    ResetPasswordParams,
    ResetPasswordErrors,
    ResetPasswordResponse
>;
