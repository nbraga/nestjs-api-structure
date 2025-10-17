import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export interface FindMeParams {
    userId: string;
    companyId: string;
}

export type FindMeResponse = {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    status: string;
    createdAt: Date;
};

export type FindMeErrors = "Usuário não encontrado" | "Erro ao buscar usuário";

export type FindMeUseCase = ServiceResponseProps<
    FindMeParams,
    FindMeErrors,
    FindMeResponse
>;
