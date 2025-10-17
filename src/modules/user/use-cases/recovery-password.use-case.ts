import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export interface RecoveryPasswordParams {
    email: string;
}

export type RecoveryPasswordResponse = null;

export type RecoveryPasswordErrors =
    | "Usuário não encontrado"
    | "Erro ao enviar email"
    | "Erro interno do servidor";

export type RecoveryPasswordUseCase = ServiceResponseProps<
    RecoveryPasswordParams,
    RecoveryPasswordErrors,
    RecoveryPasswordResponse
>;
