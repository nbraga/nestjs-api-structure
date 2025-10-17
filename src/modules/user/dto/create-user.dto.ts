import z from "zod";

export const createUserSchema = z.object({
    user: z.object({
        email: z.email("Email inválido"),
        password: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
        fullName: z
            .string()
            .min(1, "Nome é obrigatório")
            .max(100, "Nome muito longo"),
        phone: z
            .string()
            .min(11, "Telefone deve ter pelo menos 11 caracteres")
            .max(15, "Telefone deve ter 15 caracteres")
            .transform((val) => val.replace(/\D/g, "")),
    }),
    company: z.object({
        cnpj: z
            .string()
            .min(14, "CNPJ deve ter 14 caracteres")
            .max(18, "CNPJ deve ter 18 caracteres")
            .transform((val) => val.replace(/\D/g, "")),
        tradeName: z.string().min(1, "Nome fantasia é obrigatório"),
        socialName: z.string().min(1, "Razão social é obrigatório"),
    }),
    roles: z
        .array(z.enum(["PROVIDER", "PURCHASER", "ADMIN"]))
        .optional()
        .default([]),
});

export type CreateUserDto = z.infer<typeof createUserSchema>;

export function CreateUserSwaggerDto() {
    return {
        user: {
            type: "object",
            properties: {
                email: {
                    type: "string",
                    example: "user@email.com",
                    description: "Email do usuário",
                },
                password: {
                    type: "string",
                    example: "senha123",
                    description: "Senha do usuário (mínimo 6 caracteres)",
                },
                fullName: {
                    type: "string",
                    example: "João da Silva",
                    description: "Nome completo do usuário",
                },
                phone: {
                    type: "string",
                    example: "(11) 99999-9999",
                    description: "Telefone do usuário",
                },
            },
            required: ["email", "password", "fullName", "phone"],
        },
        company: {
            type: "object",
            properties: {
                cnpj: {
                    type: "string",
                    example: "12.345.678/0001-90",
                    description: "CNPJ da empresa",
                },
                tradeName: {
                    type: "string",
                    example: "Empresa Exemplo",
                    description: "Nome fantasia da empresa",
                },
                socialName: {
                    type: "string",
                    example: "Empresa Exemplo LTDA",
                    description: "Razão social da empresa",
                },
            },
            required: ["cnpj", "tradeName", "socialName"],
        },
        roles: {
            type: "array",
            items: { type: "string", enum: ["PROVIDER", "PURCHASER", "ADMIN"] },
            example: [],
            description: "Papéis do usuário (opcional, padrão: ADMIN)",
        },
    };
}
