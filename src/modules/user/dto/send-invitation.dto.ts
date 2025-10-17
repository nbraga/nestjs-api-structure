import { ApiProperty } from "@nestjs/swagger";
import { z } from "zod";

export const SendInvitationSchema = z.object({
    email: z.email(),
    roles: z.array(z.enum(["PROVIDER", "PURCHASER", "ACCOUNTANT", "ADMIN"])),
});

export type SendInvitationDto = z.infer<typeof SendInvitationSchema>;

// DTO para documentação do Swagger
export class SendInvitationSwaggerDto {
    @ApiProperty({
        description: "Email do usuário a ser convidado",
        example: "usuario@exemplo.com",
        format: "email",
    })
    email: string;

    @ApiProperty({
        description: "Roles que o usuário terá na empresa",
        example: ["PROVIDER", "PURCHASER", "ACCOUNTANT"],
        enum: ["PROVIDER", "PURCHASER", "ACCOUNTANT"],
        isArray: true,
    })
    roles: string[];
}

// DTO para resposta de sucesso
export class SendInvitationResponseSwaggerDto {
    @ApiProperty({
        description: "Mensagem de sucesso",
        example: "Convite enviado com sucesso",
    })
    message: string;

    @ApiProperty({
        description: "Dados do convite criado",
        example: {
            id: "123e4567-e89b-12d3-a456-426614174000",
            email: "usuario@exemplo.com",
            status: "PENDING",
            createdAt: "2024-07-31T12:00:00.000Z",
        },
    })
    data: Record<string, any>;
}
