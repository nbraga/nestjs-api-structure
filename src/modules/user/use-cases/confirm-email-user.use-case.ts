import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export type ConfirmEmailUserParams = string;

export type ConfirmEmailUserResponse = null;

export type ConfirmEmailUserErrors = "Usuário não encontrado";

export type ConfirmEmailUserUseCase = ServiceResponseProps<
    ConfirmEmailUserParams,
    ConfirmEmailUserErrors,
    ConfirmEmailUserResponse
>;
