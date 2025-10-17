import { z } from "zod";

export const changePasswordSchema = z.object({
    oldPassword: z.string().min(1, "Senha atual é obrigatória"),
    newPassword: z
        .string()
        .min(6, "Nova senha deve ter pelo menos 6 caracteres"),
});

export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
