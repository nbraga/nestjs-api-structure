import { ServiceResponseProps } from "@/common/interfaces/service-response-props";

export interface LoginParams {
    body: {
        email: string;
        password: string;
    };
}

export type LoginResponse = {
    user: Omit<any, "password">;
    token: string;
};

export type LoginErrors = "Email ou senha inválidos";

export interface LoginUseCase
    extends ServiceResponseProps<LoginParams, LoginErrors, LoginResponse> {}
