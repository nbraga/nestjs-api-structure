import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export type ResendConfirmEmailUserParams = string;

export type ResendConfirmEmailUserResponse = null;

export type ResendConfirmEmailUserErrors =
    | "Usuário não encontrado"
    | "Usuário já está ativo";

export type ResendConfirmEmailUserUseCase = ServiceResponseProps<
    ResendConfirmEmailUserParams,
    ResendConfirmEmailUserErrors,
    ResendConfirmEmailUserResponse
>;
