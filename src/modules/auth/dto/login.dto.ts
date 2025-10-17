import { z } from "zod";

export const LoginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(1, "Senha é obrigatória"),
});

export type LoginDto = z.infer<typeof LoginSchema>;

// Função para gerar documentação do Swagger baseada no schema Zod
export const LoginSwaggerDto = () => {
    return {
        email: {
            type: "string",
            description: "Email do usuário",
            example: "user@email.com",
        },
        password: {
            type: "string",
            description: "Senha do usuário",
            example: "senha123",
        },
    };
};
