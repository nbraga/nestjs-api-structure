import { z } from "zod";
import { ApiProperty } from "@nestjs/swagger";

export const createUserInvitationSchema = z.object({
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
});

export type CreateUserInvitationDto = z.infer<
    typeof createUserInvitationSchema
>;

// DTO para documentação do Swagger
export class CreateUserInvitationSwaggerDto {
    @ApiProperty({
        description: "Senha do usuário (mínimo 6 caracteres)",
        example: "senha123",
        minLength: 6,
    })
    password: string;

    @ApiProperty({
        description: "Nome completo do usuário",
        example: "João da Silva",
        minLength: 1,
        maxLength: 100,
    })
    fullName: string;

    @ApiProperty({
        description: "Telefone do usuário (apenas números, mínimo 11 dígitos)",
        example: "(11) 99999-9999",
        minLength: 11,
        maxLength: 15,
    })
    phone: string;
}

// DTO para resposta de sucesso
export class CreateUserInvitationResponseSwaggerDto {
    @ApiProperty({
        description: "Token de acesso gerado",
        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    })
    token: string;
}
