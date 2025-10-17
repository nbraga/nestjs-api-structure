import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export interface SendInvitationEmailParams {
    email: string;
    inviterName: string;
    invitationLink: string;
}

export type SendInvitationEmailResponse = {
    message: string;
};

export type SendInvitationEmailErrors =
    | "Erro ao enviar convite"
    | "Email inválido"
    | "Erro interno do servidor";

export type SendInvitationEmailUseCase = ServiceResponseProps<
    SendInvitationEmailParams,
    SendInvitationEmailErrors,
    SendInvitationEmailResponse
>;
