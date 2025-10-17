import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export interface SendContactUsEmailParams {
    name: string;
    email: string;
    phone: string;
    description: string;
    captchaToken: string;
}

export type SendContactUsEmailResponse = {
    message: string;
};

export type SendContactUsEmailErrors =
    | "Validação de CAPTCHA falhou"
    | "Erro ao enviar email"
    | "Erro interno do servidor";

export type SendContactUsEmailUseCase = ServiceResponseProps<
    SendContactUsEmailParams,
    SendContactUsEmailErrors,
    SendContactUsEmailResponse
>;
